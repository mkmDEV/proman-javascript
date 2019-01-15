from flask import Flask, render_template, url_for, redirect, session, request
from util import json_response

import data_handler
import password_verification

app = Flask(__name__)
app.secret_key = "bx0cxa1{Nxb7xa8)xddx86xe4xb2x7fxec"


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = data_handler.get_user_by_email(email)
        if user and password_verification.verify_password(password, user['hashed_password']):
            session['user'] = user['user_name']
            return redirect('/')
        else:
            message = "Login failed. Please check your details."
            return render_template('login.html',
                                   message=message,)
    return render_template('login.html')


@app.route("/logout")
def logout():
    if 'user' in session:
        session.pop('user', None)
        return redirect('/')


if __name__ == '__main__':
    main()
