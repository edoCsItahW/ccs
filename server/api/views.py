# ! /user/bin/python3

#  Copyright (c) 2024. All rights reserved.
#  This source code is licensed under the CC BY-NC-SA
#  (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
#  This software is protected by copyright law. Reproduction, distribution, or use for commercial
#  purposes is prohibited without the author's permission. If you have any questions or require
#  permission, please contact the author: 2207150234@st.sziit.edu.cn


"""
file: views.py
author: edocsitahw
date: 2024/11/1 下午4:14
encoding: utf-8
command:
"""

__all__ = [
    'apiBlue'
]

from .utils import unifi, userKC, addSolt
from datetime import datetime, timedelta
from .sqlTools import TB, py2sql, MySQL
from flask import Blueprint, request
from inspect import currentframe
from jwt import encode, decode
from base64 import b64decode
from bcrypt import hashpw
from ._types import *

apiBlue = Blueprint('api', __name__, url_prefix='/api')

try:
    PASSWORD: str = "135246qq"  # 定义密码
    line = currentframe().f_lineno - 1
    sql = MySQL('root', PASSWORD, 'ccs')
except NameError as e:
    e.add_note(f"请填写位于'{__file__}'第{line}行的PASSWORD!")
    raise e



@apiBlue.route("/article", methods=['POST'])
@unifi
def article() -> IATCResp:
    """
    课程(以下称为文章)数据接口

    :return: 文章列表
    """
    return [r | {'comment': list(map(lambda x: {'date': x['date'].strftime('%Y/%m/%d'), 'content': x['content'], 'user': userKC(sql.tb.select(tbName='users', cfg=TB.Select.WHERE(f"id={x['user_id']}"))[0])}, sql.tb.select(tbName='comments', cfg=TB.Select.WHERE(f"course_id={r['id']}")) or []))} for r in sql.tb.select(tbName='courses') or []]


@apiBlue.route("/comment", methods=['POST'])
@unifi
def comment() -> IResponse[None]:
    """
    评论数据接口

    :return: 评论成功
    """
    data: ICommentReq = request.json  # {content: str, id: int, uid: int, date: YYYY/MM/DD}

    sql.tb.table = 'comments'

    try:
        sql.tb.insert(user_id=data['uid'], course_id=data['id'], content=data['content'], date=datetime.strptime(data['date'], '%Y/%m/%d').strftime('%Y-%m-%d'))

    except Exception as e:
        return {'code': 500, 'data': None, 'msg': ''.join(e.args)}

    # 其余时候返回空


@apiBlue.route("/user", methods=['POST'])
@unifi
def user() -> IUserResp:
    """
    用户数据接口

    :return: 用户信息
    """
    data: IUserReq = request.json

    match data['type']:
        case 'query':
            if r := sql.tb.select(tbName='users', cfg=TB.Select.WHERE(f"name={py2sql(data['data'])}" if isinstance(data['data'], str) else f"id={data['data']}")):
                return userKC(r[0])

        case 'check':
            token = data['token']

            if token:
                try:
                    tokenDict = decode(token, apiBlue.secret_key, algorithms=['HS256'])

                    if len(res := sql.tb.select(tbName='users', cfg=TB.Select.WHERE(f"name={py2sql(tokenDict['name'])}"))):
                        return userKC(res[0])

                    return {'code': 401, 'data': None, 'msg': 'token失效'}

                except Exception as e:
                    return {'code': 401, 'data': None, 'msg': ''.join(e.args)}

            return {'code': 401, 'data': None, 'msg': 'token错误'}


@apiBlue.route("/login", methods=['POST'])
@unifi
def login() -> ILoginResp:
    """
    登录接口

    :return: 登录响应
    """
    data: ILoginReq = request.json  # {name: str, password: str, time: datetime}

    if r := sql.tb.select(tbName='users', cfg=TB.Select.WHERE(f"name='{data['name']}'")):
        orgPwd, solt = r[0]['password'], r[0]['solt']

        if hashpw(data['password'].encode('utf-8'), solt.encode('utf-8')).decode('utf-8') == orgPwd:
            token = encode({'name': data['name'], 'exp': int((datetime.strptime(data['time'], '%Y/%m/%d %H:%M:%S') + timedelta(hours=1)).timestamp())}, apiBlue.secret_key, algorithm='HS256')
            return {'user': userKC(r[0]), 'token': token}

    return {'code': 401, 'data': None, 'msg': '用户名或密码错误'}


@apiBlue.route("/register", methods=['POST'])
@unifi
def register() -> IRegisterResp:
    """
    注册接口

    :return: 注册响应
    """
    data: IRegisterReq = request.json  # {name: str, password: str, time: datetime }

    if sql.tb.select(tbName='users', cfg=TB.Select.WHERE(f"name='{data['name']}'")):
        return {'code': 401, 'data': None, 'msg': '用户名已存在'}

    time = int((datetime.strptime(data['time'], '%Y/%m/%d %H:%M:%S') + timedelta(hours=1)).timestamp())
    data['date'] = datetime.now().strftime('%Y-%m-%d')
    del data['time']

    data['solt'], data['password'] = addSolt(data['password'])
    print(data)
    sql.tb.table = 'users'

    try:
        sql.tb.insert(**data)

    except Exception as e:
        return {'code': 500, 'data': None, 'msg': ''.join(e.args)}

    token = encode({'name': data['name'], 'exp': time}, apiBlue.secret_key, algorithm='HS256')

    return {'user': userKC(sql.tb.select(tbName='users', cfg=TB.Select.WHERE(f"name={py2sql(data['name'])}"))[0]), 'token': token}


@apiBlue.route("/upload", methods=['POST'])
@unifi
def upload() -> IUploadResp:
    data: IUploadReq = request.json  # {data: base64, path: str, uid: int}

    try:
        if data['data'].startswith('data:image/'):
            data['data'] = data['data'].split(',')[1]

        with open(f"./static/img/{data['name'].replace('%', '')}", 'wb') as f:
            f.write(b64decode(data['data']))

    except Exception as e:
        return {'code': 500, 'data': None, 'msg': ''.join(e.args)}

    else:
        sql.tb.table = 'users'
        sql.tb.update(img=(p := f"./static/img/{data['name']}".replace('%', '')), cfg=TB.Update.WHERE(f"id='{data['uid']}'"))

        return p


@apiBlue.route("/search", methods=['POST'])
@unifi
def search() -> ISearchResp:
    data: ISearchReq = request.json  # {key: str}

    if data['key']:
        articles = list(map(lambda x: {'data': x.get('title'), 'type': 'article'}, sql.tb.select(tbName='courses', cfg=TB.Select.WHERE(f"title LIKE '%{data['key']}%'")) or []))  # 仅提供标题搜索,不提供内容搜索
        users = list(map(lambda x: {'data': userKC(x), 'type': 'user'}, sql.tb.select(tbName='users', cfg=TB.Select.WHERE(f"name='{data['key']}'")) or []))
        return articles + users

    return []


@apiBlue.route("/score", methods=['POST'])
@unifi
def score():
    # TODO: 实现评分功能
    data = request.json  # {id: int, star: int}

    print(data)
