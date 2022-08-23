DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

-- department
-- id: INT PRIMARY KEY
-- name: VARCHAR(30) to hold department name

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30) NOT NULL
);

-- role
-- id: INT PRIMARY KEY
-- title: VARCHAR(30) to hold role title
-- salary: DECIMAL to hold role salary
-- department_id: INT to hold reference to department role belongs to
-- https://docs.microsoft.com/en-us/sql/t-sql/data-types/decimal-and-numeric-transact-sql?view=sql-server-ver16

CREATE TABLE job_role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL (10,2),
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

-- employee
-- id: INT PRIMARY KEY
-- first_name: VARCHAR(30) to hold employee first name
-- last_name: VARCHAR(30) to hold employee last name
-- role_id: INT to hold reference to employee role
-- manager_id: INT to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  -- connect role id to role_id
  FOREIGN KEY (role_id)
  REFERENCES job_role(id)
  ON DELETE SET NULL,
  -- connect employee id to manager_id
  FOREIGN KEY (manager_id)
  REFERENCES employee(id)
  ON DELETE SET NULL
);