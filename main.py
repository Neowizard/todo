import json
from flask import Flask, request, jsonify, send_file, redirect, render_template
from flask_cors import CORS
import os
import string
import random

app = Flask(__name__)
app.logger.setLevel('DEBUG')
CORS(app)


def generate_random_string(length):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))


@app.route('/')
def serve_root():
    list_id = generate_random_string(8)
    return redirect(f'/{list_id}')


@app.route('/<list_id>', methods=['GET'])
def serve_todo_list(list_id):
    app.logger.info(f'Serving {list_id}')
    return render_template('index.html', list_id=list_id)


@app.route('/<path:filename>')
def serve_static(filename):

    app.logger.info(f'Serving file {filename}')
    return send_file(filename)


@app.route('/todo/<list_id>', methods=['POST'])
def save_task_list(list_id):
    app.logger.info(f'Storing todos in {list_id}')
    todo_file = os.path.join('todos', f'{list_id}.txt')
    os.makedirs("todos", exist_ok=True)
    try:
        task_list = request.get_json(force=True)
        with open(todo_file, 'wt') as file:
            json.dump(task_list, file)
        return 'Task list saved successfully!', 200
    except Exception as e:
        return f'Error saving task list: {str(e)}', 500


@app.route('/todo/<list_id>', methods=['GET'])
def get_task_list(list_id):
    app.logger.info(f'Fetching {list_id}')
    todo_file = os.path.join('todos', f'{list_id}.txt')
    try:
        with open(todo_file, 'rt') as file:
            task_list = json.load(file)
        return jsonify(task_list), 200
    except FileNotFoundError:
        return jsonify([]), 200
    except Exception as e:
        return f'Error retrieving task list: {str(e)}', 500


if __name__ == '__main__':
    from waitress import serve
    serve(app, host='0.0.0.0', port=8080)
