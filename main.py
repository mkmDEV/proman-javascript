from flask import Flask, render_template, url_for, redirect, session, request
from flask import Flask, render_template, url_for, request
from util import json_response
import psycopg2

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


@app.route('/registration')
def load_registration_page():
    return render_template('registration.html')


@app.route('/registration', methods=['POST'])
def registration():
    user_data = {'user_name': request.form['username'],
                 'user_password': request.form['password'],
                 'confirm_password': request.form['confirm']}
    hashed_password = password_verification.hash_password(user_data['user_password'])
    if password_verification.verify_password(user_data['confirm_password'], hashed_password) is True:
        message = 'Your registration was successful. Please, log in to continue!'
        try:
            data_handler.save_user(user_data, hashed_password)
            return render_template('registration.html', message=message)
        except psycopg2.IntegrityError as e:
            error_message = 'Something went wrong. Please, try again!'
            if 'user_pk' in str(e):
                error_message = 'This username is taken.'
            elif 'user_user_email_uindex' in str(e):
                error_message = 'This email is taken.'
            return render_template('registration.html', message=error_message)
    else:
        message = 'The passwords don\'t match. Please, try again!'
    return render_template('registration.html',
                           message=message,
                           username=request.form['username'],
                           email=request.form['email'])


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
            session['user'] = user['username']
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
