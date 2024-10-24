CREATE TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);

insert into blogs (url,author,title) values ('https://overreacted.io/on-let-vs-const/', 'Dan Abramov', 'On let vs const');

insert into blogs (url,author,title) values ('https://www.cybertec-postgresql.com/en/gaps-in-sequences-postgresql/', 'Laurenz Albe', 'Gaps in sequences in PostgreSQL');

select * from blogs;
