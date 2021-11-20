INSERT INTO department (name)
VALUES
    ('billing'),
    ('sales'),
    ('IT'),
    ('facilities'),
    ('engineering');

INSERT INTO roles (title,salary,department_id)
VALUES
    ("Accountant",50000.0,1),
    ("Secretary",30000.0,1),
    ("Salesman",10000.0,2),
    ("Sales Manager",40000.0,2),
    ("Software Developer",60000.0,3),
    ("System Engineer",70000.0,3),
    ("Janitor",30000.0,4),
    ("Engineer",50000.0,5),
    ("CEO",100000.0,1);
INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES
    ("The","Boss",8,NULL),
    ("Victor","Weinert",5,1),
    ("Maria","Wong",6,1),
    ("raj","something",5,1);
    