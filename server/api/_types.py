# ! /user/bin/python3

#  Copyright (c) 2024. All rights reserved.
#  This source code is licensed under the CC BY-NC-SA
#  (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
#  This software is protected by copyright law. Reproduction, distribution, or use for commercial
#  purposes is prohibited without the author's permission. If you have any questions or require
#  permission, please contact the author: 2207150234@st.sziit.edu.cn

"""
file: _types.py
author: edocsitahw
date: 2024/11/4 下午1:43
encoding: utf-8
command:
"""

__all__ = [
    'IResponse',
    'IUser',
    'IComment',
    'IArticle',
    'IATCResp',
    'IUserResp',
    'ILogin',
    'ILoginResp',
    'IRegisterResp',
    'IUploadResp',
    'ISearch',
    'ISearchResp',
    'ICommentReq',
    'IUserReq',
    'ILoginReq',
    'IRegisterReq',
    'ISearchReq',
    'IUploadReq'
]

from typing import Generic, TypeVar, TypedDict, List, Optional, Any, Literal

# --------------------------- Response ---------------------------


T = TypeVar('T')


class IResponse(Generic[T], TypedDict):
    """
    HTTP请求响应数据类型定义

    :ivar data: 响应数据
    :type data: Any
    :ivar code: 状态码
    :ivar msg: 状态信息
    """
    data: Optional[T]
    code: int
    msg: str


class IUser(TypedDict):
    """
    用户数据类型定义

    :ivar id: 用户ID
    :ivar name: 用户名
    :ivar img: 用户头像相对路径
    :ivar password: 用户密码
    :ivar solt: 用户密码盐
    """
    id: int
    name: str
    img: str
    password: Optional[str]
    solt: Optional[str]


class IComment(TypedDict):
    """
    评论数据类型定义

    :ivar content: 评论内容
    :ivar date: 评论日期
    :ivar user: 评论用户信息
    """
    content: str
    date: str
    user: IUser


class IArticle(TypedDict):
    """
    文章数据类型定义

    :ivar id: 文章ID
    :ivar imgUrl: 文章图片相对路径
    :ivar title: 文章标题
    :ivar teacher: 文章作者
    :ivar text: 文章内容
    :ivar star: 文章评分
    :ivar comment: 文章评论列表
    """
    id: int
    imgUrl: str
    title: str
    teacher: str
    text: str
    star: int
    comment: List[IComment]


IATCResp = IResponse[List[IArticle]]

IUserResp = IResponse[Optional[IUser]]


class ILogin(TypedDict):
    """
    登录数据类型定义

    :ivar token: 用户登录令牌
    :ivar user: 用户信息
    """
    token: str
    user: IUser


ILoginResp = IRegisterResp = IResponse[ILogin]

IUploadResp = IResponse[str]


class ISearch(TypedDict):
    """
    搜索数据类型定义

    :ivar data: 搜索结果
    :ivar type: 搜索类型
    """
    data: str | IUser
    type: Literal['user', 'article']


ISearchResp = IResponse[ISearch]


# ------------------------------ Request ---------------------------------


class ICommentReq(TypedDict):
    """
    评论数据类型定义

    :ivar id: 文章ID
    :ivar uid: 用户ID
    :ivar content: 评论内容
    :ivar date: 评论日期(格式: YYYY/MM/DD)
    """
    id: int
    uid: int
    content: str
    date: str


class IUserReq(TypedDict):
    """
    用户数据类型定义

    :ivar data: 用户名或id
    :ivar type: 查询类型
    """
    data: int | str
    type: Literal['check', 'query']
    token: Optional[str]


class ILoginReq(TypedDict):
    """
    登录数据类型定义

    :ivar name: 用户名
    :ivar password: 密码
    :ivar time: 时间(格式: YYYY/MM/DD HH:MM:SS)
    """
    name: str
    password: str
    time: str


IRegisterReq = ILoginReq


class IUploadReq(TypedDict):
    """
    上传数据类型定义

    :ivar data: 上传文件内容(base64编码)
    :ivar path: 上传文件路径(URL编码)
    :ivar uid: 用户ID
    """
    data: str
    name: str
    uid: int


class ISearchReq(TypedDict):
    """
    搜索数据类型定义

    :ivar key: 搜索关键字
    """
    key: str
