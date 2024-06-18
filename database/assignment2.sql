--Adding new record to account table
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES(
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--Modify Tony Stark record 
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
--Delete Tony Stark record
DELETE FROM public.account
WHERE account_id = 1;
--Modify GM Hummer from small to huge
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
--INNER JOIN exercise 
SELECT inv_make,
    inv_model,
    classification_name
FROM public.inventory
    INNER JOIN public.classification on inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';
--Update file path to add /vehicles
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');