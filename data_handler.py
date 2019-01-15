import persistence
import database_common


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards(force=True)


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
def get_boards(cursor, title):
    cursor.execute("""INSERT INTO "boards" (title)
                   VALUES (%(title)s);""",
                   {'title': title['title']})
