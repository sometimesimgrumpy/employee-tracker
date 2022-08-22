-- check video for seeds
INSERT INTO department (dept_name)
VALUES 
    ("Sales"),
    ("Legal"),
    ("Finance"),
    ("Engineering");

INSERT INTO job_role (title, salary, department_id)
VALUES 
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2), 
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES
    ("Eren", "Yeager", 1, null),
    ("Armin", "Arlert", 2, 1),
    ("Mikasa", "Ackerman", 3, null),
    ("Reiner", "Braun", 4, 3),
    ("Sasha", "Blouse", 5, null),
    ("Connie", "Springer", 6, 5),
    ("Annie", "Leonhart", 7, null),
    ("Hange", "Zoe", 8, 7);
