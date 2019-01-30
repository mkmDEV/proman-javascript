import persistence
import database_common
from flask import session


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


@database_common.connection_handler
def get_boards(cursor):
    cursor.execute("""SELECT *
                      FROM boards""",)
    boards = cursor.fetchall()
    return boards


@database_common.connection_handler
def get_cards(cursor):
    cursor.execute("""SELECT *
                      FROM cards""",)
    cards = cursor.fetchall()
    return cards


def get_cards_for_board(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards


@database_common.connection_handler
def save_user(cursor, user_data, hashed_password):
    cursor.execute("""INSERT INTO "users" (username, email, hashed_password)
                   VALUES (%(user_name)s, %(email)s, %(hashed_password)s);""",
                   {'user_name': user_data['user_name'],
                    'email': user_data['user_email'],
                    'hashed_password': hashed_password})


@database_common.connection_handler
def get_user_by_email(cursor, email):
    cursor.execute("""SELECT * FROM "users"
                      WHERE email=%(email)s""",
                   {'email': email})
    user_data = cursor.fetchone()
    return user_data


@database_common.connection_handler
def new_board(cursor, board_title):
    cursor.execute("""INSERT INTO "boards" (board_title)
                   VALUES (%(board_title)s);""",
                   {'board_title': board_title})


@database_common.connection_handler
def new_card(cursor, card_data, board_id):
    cursor.execute("""INSERT INTO "cards" (card_info, card_status, card_board_id)
                   VALUES (%(card_info)s, %(card_status)s, %(card_board_id)s);""",
                   {'card_info': card_data['card_info'],
                    'card_status': card_data['card_status'],
                    'card_board_id': board_id})


@database_common.connection_handler
def delete_card(cursor, card_id):
    cursor.execute("""DELETE FROM cards WHERE id=%(card_id)s;""",
                   {'card_id': card_id})


@database_common.connection_handler
def delete_board(cursor, board_id):
    cursor.execute("""DELETE FROM boards WHERE id=%(board_id)s;""",
                   {'board_id': board_id})


@database_common.connection_handler
def get_board_by_id(cursor, board_id):
    cursor.execute("""SELECT board_title FROM boards
                    WHERE id=%(board_id)s""",
                   {'board_id': board_id})
    board_title = cursor.fetchone()
    return board_title['board_title']


@database_common.connection_handler
def get_card_by_id(cursor, card_id):
    cursor.execute("""SELECT card_info, card_status FROM cards
                    WHERE id=%(card_id)s""",
                   {'card_id': card_id})
    card_info = cursor.fetchone()
    return card_info


@database_common.connection_handler
def rename_board(cursor, board_id, board_title):
    cursor.execute("""UPDATE boards SET board_title=%(board_title)s
                    WHERE id=%(board_id)s""",
                   {'board_id': board_id,
                    'board_title': board_title})


@database_common.connection_handler
def update_card(cursor, card_id, card_info, card_status):
    cursor.execute("""UPDATE cards SET card_info=%(card_info)s, card_status=%(card_status)s
                    WHERE id=%(card_id)s""",
                   {'card_id': card_id,
                    'card_info': card_info,
                    'card_status': card_status})
