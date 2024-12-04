# ! /user/bin/python3

#  Copyright (c) 2024. All rights reserved.
#  This source code is licensed under the CC BY-NC-SA
#  (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
#  This software is protected by copyright law. Reproduction, distribution, or use for commercial
#  purposes is prohibited without the author's permission. If you have any questions or require
#  permission, please contact the author: 2207150234@st.sziit.edu.cn

"""
file: app.py
author: edocsitahw
date: 2024/10/29 下午2:25
encoding: utf-8
command:
"""

from flask import Flask, render_template, request
from api import sqlTools


app = Flask(__name__, static_folder=r"./static", template_folder=r"./template")
app.secret_key = "slot"
# csrf = CSRFProtect(app)
sqlTools.OUTPUT = False


@app.route("/", methods=["GET", "POST"])
def root() -> str:
    return render_template(r"index.html")


if __name__ == '__main__':
    from api import apiBlue
    apiBlue.secret_key = app.secret_key
    app.register_blueprint(apiBlue)
    app.run(host="0.0.0.0", debug=True)

