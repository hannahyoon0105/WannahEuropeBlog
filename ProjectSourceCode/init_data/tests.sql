INSERT INTO users (username, password, admin) 
VALUES 
    ('WesAllen01', '$2b$10$eJZUppv4v9r0oSGkTWyuSuiBOFtlZXOSTQdx7C10oBFt38FUKJOta', true),
    ('hannah', '$2b$10$CHVk3ob/GMGtDISadesLeOnlG4LjnH.NygVmbaDQY4zvf98.RUS46', true),
    ('wannah', '$2b$10$CHVk3ob/GMGtDISadesLeOnlG4LjnH.NygVmbaDQY4zvf98.RUS46', true),
    ('duncan', '$2b$10$i.eCPpWl.qxqjPPdlpdShujDSnP3iTyQ3hZePbyrbs6PU2af/5aAS', false);

INSERT INTO posts (caption, author, date_created, bingo_id)
VALUES 
    ('This is a test post', 'wannah', '2021-04-01 12:00:00', NULL),
    ('This is another test post', 'wannah', '2021-04-01 12:00:00', NULL ),
    ('This is a third test post', 'wannah', '2021-04-01 12:00:00', NULL);

INSERT INTO images (post_id, filepath)
VALUES 
    (1, '/resources/xina.jpg'),
    (2, '/resources/xina.jpg'),
    (2, 'https://www.cu.edu/sites/default/files/2023_cu_home_bldr-chancellor.jpg'),
    (3, 'https://www.cu.edu/sites/default/files/2023_cu_home_bldr-chancellor.jpg');

INSERT INTO likes (post_id, username)
VALUES 
    (1, 'WesAllen01'),
    (1, 'duncan'),
    (2, 'duncan'),
    (2, 'hannah'),
    (3, 'WesAllen01'),
    (3, 'hannah'),
    (3, 'duncan');


INSERT INTO bingo (body, completed, post_id)
VALUES 
    ('Get pickpocketed', false, NULL),
    ('Get scammed', false, NULL),
    ('Evade a scam', false, NULL),
    ('Have an ', false, NULL),
    ('Get made fun of for our American accent', false, NULL),
    ('See a celebrity', false, NULL),
    ('Ride a gondola', false, NULL),
    ('Get lawst', false, NULL),
    ('Cancel plans to take a nap', false, NULL),
    ('Have an annoying hostelmate', false, NULL),
    ('Meet some new friends', false, NULL),
    ('Enjoy an aperitivo', false, NULL),
    ('Order in italian successfully', false, NULL),
    ('See the Eiffel Tower sparkle', false, NULL),
    ('Someone tries to sell us drugs', false, NULL),
    ('Something goes unbelievably wrong', false, NULL),
    ('Something goes unbelievably right', false, NULL),
    ('Decide something is helllaaa overrated', false, NULL),
    ('Wait for something longer than a hour and find it is worth it', false, NULL),
    ('Struggle to find a public bathroom', false, NULL),
    ('Meet someone else from Colorado', false, NULL),
    ('It gets unbearably inescapably hot', false, NULL),
    ('Misplace something important', false, NULL),
    ('Have the best we have ever had in our entire lves', false, NULL),
    ('Miss a train station', false, NULL);
