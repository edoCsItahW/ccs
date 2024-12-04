# ! /user/bin/python3

#  Copyright (c) 2024. All rights reserved.
#  This source code is licensed under the CC BY-NC-SA
#  (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
#  This software is protected by copyright law. Reproduction, distribution, or use for commercial
#  purposes is prohibited without the author's permission. If you have any questions or require
#  permission, please contact the author: 2207150234@st.sziit.edu.cn

"""
file: utils.py
author: edocsitahw
date: 2024/11/1 下午4:17
encoding: utf-8
command:
"""

__all__ = [
    'HttpResp',
    'addSolt',
    'serverInfo',
    'unifi',
    'keyControl',
    'userKC'
]

from typing import Any, Callable, TypedDict, Literal
from flask import request, jsonify, Response
from functools import wraps, partial
from bcrypt import gensalt, hashpw
from datetime import datetime


class HttpResp(TypedDict):
    code: int
    data: Any
    msg: str


def addSolt(passwd: str) -> tuple[str, str]:
    """
    哈希盐

    :param passwd: 密码
    :return: 加盐后的密码哈希值
    """
    return (s := gensalt()).decode('utf-8'), hashpw(passwd.encode('utf-8'), s).decode('utf-8')


def serverInfo(data: Any, *, dst: Literal['in', 'out'] = 'in', code: int = 200) -> None:
    """
    格式化服务器信息

    :param data: 服务器信息(可打印)
    :type data: 具有__str__或__repr__魔术方法的对象
    :keyword dst: 方向(默认为in, 入站)
    :keyword code: 状态码(默认为200)
    """
    print(f'{request.remote_addr} - - [{datetime.now().strftime("%d/%b/%Y %H:%M:%S")}] "{request.method} {request.path} {"<- " if dst == "in" else "-> "}{data} {code} -')


def unifi(fn: Callable[[Any, ...], Any]) -> Callable[[Any, ...], Response]:
    """
    统一接口返回格式,并做日志记录

    :param fn: 接口函数
    :return: 统一接口返回格式的函数
    """

    @wraps(fn)
    def wrapper(*args, **kwargs) -> Response:
        serverInfo(request.json, dst='in')

        try:
            res = fn(*args, **kwargs)

        except Exception as e:
            serverInfo(str(e), dst='out', code=500)

        else:
            if not isinstance(res, dict) or any(k not in res.keys() for k in ['code', 'data', 'msg']):  # 检测返回值是否符合规范
                serverInfo(r := {'data': res, 'code': 200, 'msg': 'ok'}, dst='out')

                return jsonify(r)

            serverInfo(res, dst='out', code=res['code'])

            return jsonify(res)

    return wrapper


def keyControl(data: dict, *, delete: list = None) -> dict:
    """
    删除输入字典指定字段

    :param data: 输入字典
    :param delete: 要删除的字段列表
    :return: 处理后的原字典
    """
    for k in delete or []:
        if k in data: del data[k]

    return data


userKC: Callable[[dict], dict] = partial(keyControl, delete=['date', 'password', 'solt'])
