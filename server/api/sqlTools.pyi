__all__: list

from pymysql.cursors import Cursor
from functools import wraps
from functools import cached_property
from warnings import warn
from pymysql import Connection, NULL
from typing import Callable, final, Self, TypedDict, Protocol, Any, Optional
from types import TracebackType, FunctionType as function
from enum import Enum
from abc import ABC
from pandas import DataFrame


SERVER_NAME: str
OUTPUT: bool


class Result(TypedDict):
    result: tuple[tuple[Any, ...], ...]
    header: list[str] | tuple
    rowcount: int
    spendtime: Optional[float]


class Type(Enum):
    VARCHAR = 'varchar'
    INT = 'int'
    CHAR = 'char'
    DATE = 'date'
    FLOAT = 'float'
    TIME = 'time'
    BOOLEAN = 'boolean'


FlagOrStr: Optional[bool | str | None]


class CanBeStr(Protocol):

    def __str__(self) ->str:
        ...
        ...

    def __repr__(self) ->str:
        ...
        ...


class ArgumentError(Exception):

    def __init__(self, *args):
        super().__init__(*(args or ('Invalid arguments',)))
        ...


def stderr(msg: str) ->None:
    print(f'\x1b[31m{msg}\x1b[0m')
    ...


def stdout(msg: str, *, allow: bool=True, **kwargs) ->None:
    ...


@final
class Feedback:

    @staticmethod
    def normal(rowcount: int, *, spendtime: float=0.0) ->str:
        ...

    @staticmethod
    def query(rowcount: int, *, spendtime: float=0.0) ->str:
        ...

    @staticmethod
    def empty(*, spendtime: float=0.0) ->str:
        ...

    @staticmethod
    def alter(rowcount: int) ->str:
        ...

    @staticmethod
    def useDb() ->str:
        ...


def result(res: Result, fbFn: (Callable[..., str] | function)=None) ->Callable[
    ..., Any]:

    def getfunc(fn: Callable) ->Callable:

        @wraps(fn)
        def warp(*_args, **_kwargs) ->Any:
            ...


def remap(_format: str, mapping: dict[str, str], **kwargs: str) ->str:
    ...


def execute(conn: Connection, cur: Cursor, res: Result, cmd: str, *, allow:
    bool=True) ->None:
    stdout(cmd + ('' if cmd.endswith(';') else ';'), allow=allow
        ) if allow else ...
    ...


class Field:

    def __init__(self, key: str, default: Optional[str | int | Type | tuple
        [Any, Any]], *, handle: Callable[[str], str]=lambda x: f' {x}',
        required: list[str]=None, err: bool=False):
        ...

    @property
    def value(self) ->str:
        ...

    @property
    def result(self) ->dict[str, str]:
        ...

    def __str__(self) ->str:
        ...

    def __or__(self, other: (Self | dict[str, str])) ->dict[str, str]:
        ...

    def __ror__(self, other: (Self | dict[str, str])) ->dict[str, str]:
        ...

    def __call__(self, value: (str | bool | None | Type)) ->Self:
        ...

    def related(self, other: Self, **kwargs: str) ->None:
        """关联字段"""
        ...


class Base(ABC):

    @final
    def __new__(cls, *args, **kwargs):
        ...


class DB:


    @final
    class Create(ABC):
        EXISTS = Field('exists', 'IF NOT EXISTS', required=['IF NOT EXISTS'])
        CHARSET = Field('charset', 'utf8mb4', handle=lambda x:
            f' CHARACTER SET {x}')
        COLLATE = Field('collate', 'utf8mb4_general_ci', handle=lambda x:
            f' COLLATE {x}')


    @final
    class Drop(ABC):
        EXISTS = Field('exists', 'IF EXISTS', required=['IF EXISTS'])


class Database(Base):

    def __init__(self, conn: Connection, cur: Cursor, database: Optional[
        str]=None, *, table: str=None):
        ...

    @result(Base._res, Feedback.normal)
    def show(self) ->None:
        """显示数据库列表"""
        ...

    @result(Base._res, Feedback.useDb)
    def use(self, database: str=None) ->None:
        """切换数据库"""
        ...

    @result(Base._res, Feedback.query)
    def create(self, dbName: str, *, cfg: (Field | dict[str, str | bool |
        None | Type])=None, autoUse: bool=True) ->None:
        self._execute(remap(
            'CREATE DATABASE{exists} {dbName}{charset}{collate}', cfg,
            dbName=dbName))
        ...

    @result(Base._res, Feedback.query)
    def drop(self, dbName: str, *, cfg: (Field | dict[str, str | bool |
        None | Type])=None):
        self._execute(remap('DROP DATABASE {dbName}{exists}', cfg, dbName=
            dbName))
        ...


def py2sql(data: Any) ->Any:
    ...


class TB:


    @final
    class Create(ABC):
        TYPE = Field('type', 'int')
        LENGHT = Field('lenght', None, handle=lambda x: f'({x})' if x else '')
        LENGHT.related(TYPE, int='', varchar='128', char='255', date='',
            float='', time='', boolean='')
        NULL = Field('null', 'NOT NULL', required=['NOT NULL'])
        DEFAULT = Field('default', None, err=True)
        AUTO_INCREMENT = Field('autoIncrement', 'AUTO_INCREMENT', required=
            ['AUTO_INCREMENT'])
        PRIMARY_KEY = Field('primaryKey', 'PRIMARY KEY', required=[
            'PRIMARY KEY'])
        ENGINE = Field('engine', 'InnoDB', handle=lambda x: f' ENGINE={x}')
        CHARSET = Field('charset', 'utf8', handle=lambda x:
            f' DEFAULT CHARSET={x}')
        EXISTS = Field('exists', 'IF NOT EXISTS', required=['IF NOT EXISTS'])
        FOREIGN_KEY = Field('foreignKey', None, handle=lambda x:
            f' FOREIGN KEY ({x})', err=True)
        REFERENCES = Field('references', None, handle=lambda x:
            f' REFERENCES {x}', err=True)


    @final
    class Drop(ABC):
        EXISTS = Field('exists', 'IF EXISTS', required=['IF EXISTS'])


    @final
    class Select(ABC):
        WHERE = Field('where', None, handle=lambda x: f' WHERE {x}', err=True)
        ORDER = Field('order', None, handle=lambda x: f' ORDER BY {x}', err
            =True)
        LIMIT = Field('limit', 1, handle=lambda x: f' LIMIT {x}', err=True)
        INNER = Field('inner', None, handle=lambda x:
            f' INNER JOIN {x[0]} ON {x[1]}', err=True)
        OFFSET = Field('offset', None, handle=lambda x: f' OFFSET {x}', err
            =True)
        LEFT = Field('left', None, handle=lambda x:
            f' LEFT JOIN {x[0]} ON {x[1]}', err=True)


    @final
    class Update(ABC):
        WHERE = Field('where', None, handle=lambda x: f' WHERE {x}', err=True)


    @final
    class Alter(ABC):
        DROP = Field('drop', None, handle=lambda x: f' DROP {x}', err=True)


    @final
    class Delete(ABC):
        WHERE = Field('where', None, handle=lambda x: f' WHERE {x}', err=True)


class Table(Base):
    class _field(Field):
        ...

    class _series:
        ...

    def __init__(self, conn: Connection, cur: Cursor, *, table: str=None
        ) ->None:
        ...

    @cached_property
    def content(self) ->tuple[tuple[Any, ...], ...]:
        ...

    def __getitem__(self, item: (str | int)) ->(tuple[Any, ...] | _series):
        ...

    def __getattr__(self, item: str) ->tuple[Any, ...]:
        ...

    def __delitem__(self, key: int) ->None:
        self.delete(cfg=TB.Delete.WHERE(' and '.join(f'{k}={py2sql(v)}' for
            k, v in self.content)))
        ...

    def __iter__(self):
        ...

    def __next__(self) ->_series:
        ...

    table = property(lambda self: self._table, lambda self, value: setattr())

    @result(Base._res, Feedback.query)
    def _exec(self, cmd: str) ->None:
        self._execute(cmd)
        ...

    @result(Base._res, Feedback.query)
    def show(self) ->None:
        self._execute(f'SHOW TABLES')
        ...

    @result(Base._res, Feedback.normal)
    def describe(self) ->None:
        self._execute(f'DESCRIBE {self.table}')
        ...

    def create(self, tbName: str, *, cfg: (Field | dict[str, str | bool |
        None | Type])=None, autoUse: bool=True) ->_field:
        ...

    @result(Base._res, Feedback.query)
    def drop(self, tbName: str, *, cfg: (Field | dict[str, str | bool |
        None | Type])=None) ->None:
        self._execute(remap('DROP TABLE{exists} {tbName}', cfg, tbName=tbName))
        ...

    @result(Base._res, Feedback.query)
    def insert(self, **data: Any) ->None:
        self._execute(
            f"INSERT INTO {self.table} ({', '.join(data.keys())}) VALUES ({', '.join(map(py2sql, data.values()))})"
            )
        ...

    @result(Base._res, Feedback.query)
    def select(self, *fields: str, cfg: (Field | dict[str, str | bool |
        None | Type])=None, tbName: str=None) -> list[dict[str, Any]]:
        ...

    @result(Base._res, Feedback.query)
    def update(self, *, cfg: (Field | dict[str, str | bool | None | Type])=
        None, **data: Any) ->None:
        self._execute(remap(
            f"UPDATE {self.table} SET {', '.join(map(lambda x: f'{x[0]}={py2sql(x[1])}', data.items()))}{{where}}"
            , cfg))
        ...

    @result(Base._res, Feedback.query)
    def alter(self, tbName: str=None, *, cfg: (Field | dict[str, str | bool |
        None | Type])=None) ->None:
        ...

    @result(Base._res, Feedback.query)
    def delete(self, *, cfg: (Field | dict[str, str | bool | None | Type])=None
        ) ->None:
        self._execute(remap(f'DELETE FROM {self.table}{{where}}', cfg))
        ...

    def toDataFrame(self) ->DataFrame:
        ...

    def toCSV(self, csvPath: str) ->None:
        ...

    def fromCSV(self, csvPath: str) ->None:
        warn('Not implemented yet.', DeprecationWarning)
        ...


class MySQL(Base):

    def __init__(self, user: str, password: str, database: Optional[str]=
        None, *, host: str='localhost', table: str=None, **kwargs) ->None:
        ...

    def __enter__(self) ->Self:
        self._connect.connect()
        ...

    def __exit__(self, exc_type, exc_val, exc_tb: TracebackType) ->None:
        self._cursor.close()
        ...

    def __getattr__(self, item: str) ->Any:
        ...

    @cached_property
    def db(self) ->Database:
        ...

    @cached_property
    def tb(self) ->Table:
        ...

    table = property(lambda self: self._table, lambda self, value: setattr())

    database = property(lambda self: self._database, lambda self, value: setattr())