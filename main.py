import re
import json
from flask import Flask, request, jsonify, redirect, render_template
from flask_cors import CORS
import os
import pathlib
import string
import random

TODOS_DIR = pathlib.Path('todos')

app = Flask(__name__)
app.logger.setLevel('DEBUG')
CORS(app)


def generate_random_list_id(length):
    list_id = ''
    while (TODOS_DIR / list_id).exists():
        characters = string.ascii_letters + string.digits
        list_id = ''.join(random.choice(characters) for _ in range(length))
    return list_id


@app.route('/')
def serve_root():
    list_id = generate_random_list_id(length=16)
    return redirect(f'/{list_id}')


@app.route('/<list_id>', methods=['GET'])
def serve_todo_list(list_id):
    app.logger.info(f'Serving {list_id}')
    return render_template('index.html', list_id=list_id)


def _verify_list_id(list_id):
    alphanumeric = r'^[a-zA-Z0-9]+$'
    match = re.match(alphanumeric, list_id)
    print(match)
    return match is not None


@app.route('/todo/<list_id>', methods=['POST'])
def save_task_list(list_id):
    if not _verify_list_id(list_id):
        print(f'List ID "{list_id}" is invalid')
        return f'Invalid list id {list_id}', 400

    app.logger.info(f'Storing todos in {list_id}')
    todo_file = os.path.join(TODOS_DIR, f'{list_id}.txt')
    try:
        task_list = request.get_json(force=True)
        with open(todo_file, 'wt') as file:
            json.dump(task_list, file)
        return 'Task list saved successfully!', 200
    except Exception as e:
        return f'Error saving task list: {str(e)}', 500


@app.route('/todo/<list_id>', methods=['GET'])
def get_task_list(list_id):
    if not _verify_list_id(list_id):
        print(f'List ID "{list_id}" is invalid')
        return f'Invalid list id {list_id}', 400

    app.logger.info(f'Fetching {list_id}')
    todo_file = os.path.join(TODOS_DIR, f'{list_id}.txt')
    try:
        with open(todo_file, 'rt') as file:
            task_list = json.load(file)
        return jsonify(task_list), 200
    except FileNotFoundError:
        return jsonify([]), 200
    except Exception as e:
        return f'Error retrieving task list: {str(e)}', 500


if __name__ == '__main__':
    os.makedirs(TODOS_DIR, exist_ok=True)
    from waitress import serve
    serve(app, host='0.0.0.0', port=8080)
