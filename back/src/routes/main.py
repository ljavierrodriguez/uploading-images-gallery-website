from flask import Blueprint, jsonify

bpMain = Blueprint('bpMain', __name__)

@bpMain.route('/')
def main():
    return jsonify({ "message": "Welcome to my REST API"}), 200
