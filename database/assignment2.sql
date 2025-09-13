-- assignment2.sql
-- Author: Nely
-- Date: 9/13/2025 
-- Purpose: Assignment 2 SQL queries

/*
   1. Insert a new record into the account table.
   Note: account_id and account_type are handled automatically.
*/
INSERT INTO account (first_name, last_name, email, password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


/*
   2. Update the Tony Stark record to change account_type to "Admin".
   Use the account_id PK if you know it, otherwise email for uniqueness.
*/
UPDATE account
SET account_type = 'Admin'
WHERE email = 'tony@starkent.com';
/*
   3. Delete the Tony Stark record from the account table.
*/
DELETE FROM account
WHERE email = 'tony@starkent.com';
/* 4 and 6 are below, after the joins. */

/*
   5. Inner join inventory and classification:
      Select make, model, and classification name
      for items in the "Sport" category.
*/
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';



-- Assignment 2 additions (queries 4 and 6)

/*
   4. Update GM Hummer description using REPLACE().
*/
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

/*
   6. Update image and thumbnail paths to include "/vehicles".
*/
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
