DROP TABLE IF EXISTS users;
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(60) NOT NULL,
    admin BOOLEAN NOT NULL
    -- you guys had password as char and idk why
);

DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    author VARCHAR(50) NOT NULL REFERENCES users(username),
    caption VARCHAR(2000),
    date_created TIMESTAMP NOT NULL
);

DROP TABLE IF EXISTS images;
CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(post_id),
    filepath VARCHAR(2000) NOT NULL
);

DROP TABLE IF EXISTS bingo;
CREATE TABLE bingo (
    item_id SERIAL PRIMARY KEY,
    body VARCHAR(100),
    completed BOOLEAN NOT NULL,
    post_id INTEGER REFERENCES posts(post_id) NULL
);

ALTER TABLE posts
ADD COLUMN bingo_id INTEGER REFERENCES bingo(item_id) NULL;


DROP TABLE IF EXISTS likes;
CREATE TABLE likes (
    post_id INTEGER NOT NULL REFERENCES posts(post_id),
    username VARCHAR(50) NOT NULL REFERENCES users(username),
    PRIMARY KEY (post_id, username)
);

DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(post_id),
    username VARCHAR(50) NOT NULL REFERENCES users(username),
    body TEXT NOT NULL,
    date_created TIMESTAMP WITH TIME ZONE NOT NULL
);



