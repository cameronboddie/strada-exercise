async def migrate(connection):
    async def migrate(connection):
        """Creates multiple tables in a single migration."""

    await connection.execute(
        """
        CREATE TABLE teams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
        """
    )

    await connection.execute(
        """
        CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        featured_image TEXT,
        team_id INTEGER REFERENCES teams (id) ON DELETE CASCADE,
        tags TEXT,
        parent_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES collections (id) ON DELETE CASCADE
    );
        """
    )

    await connection.execute(
        """
        CREATE TABLE IF NOT EXISTS content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        medium TEXT CHECK (medium IN ('Art', 'Photography')),
        year INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        height REAL,
        width REAL,
        depth REAL,
        dimensions_unit TEXT CHECK (dimensions_unit IN ('Inches', 'Centimeters')),
        price REAL,
        condition TEXT CHECK (condition IN ('Undamaged', 'Damaged')), 
        edition_number TEXT,
        description TEXT,
        assigned_teams TEXT,
        collection_id INTEGER NOT NULL, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (collection_id) REFERENCES collections (id) ON DELETE CASCADE
    );
        """
    )

    await connection.execute(
        """
        CREATE TABLE invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            recipient TEXT NOT NULL,
            amount REAL NOT NULL,
            due_date DATE NOT NULL,
            status TEXT CHECK (status IN ('Pending', 'Paid')) NOT NULL,
            paid_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
    )

    await connection.execute(
        """
        INSERT INTO invoices (title, recipient, amount, due_date, status, paid_at) VALUES
            ('William Test', 'Laci Taylor', 5000.00, '2025-02-19', 'Pending', NULL),
            ('Design Services', 'Laci Taylor', 6000.00, '2025-01-31', 'Pending', NULL),
            ('Art Auction Setup Charges', 'Bryan Cash', 6000.00, '2025-01-31', 'Pending', NULL),
            ('Digital Marketing', 'Bryan Cash', 2000.00, '2024-12-31', 'Pending', NULL),
            ('Framing Costs', 'Laci Taylor', 850.00, '2024-12-31', 'Paid', '2024-12-31 10:30:00'),
            ('Test Invoice', 'Bryan Cash', 5500.00, '2024-11-30', 'Paid', '2024-11-30 09:45:00'),
            ('Artwork Transport Services', 'Laci Taylor', 4750.00, '2024-11-30', 'Paid', '2024-11-30 12:15:00'),
            ('Curation Services', 'Laci Taylor', 6000.00, '2024-11-30', 'Paid', '2024-11-30 15:00:00');
        """
    )
    await connection.execute(
        """
        INSERT INTO teams (id, name) VALUES 
        (1, 'Personal'),
        (2, 'Business'),
        (3, 'Arts'),
        (4, 'Politics'),
        (5, 'Technology');
        """
    )
    await connection.execute(
        """
        CREATE TABLE roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
        """
    )

    await connection.execute(
        """
        CREATE TABLE permissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
        """
    )

    await connection.execute(
        """
        CREATE TABLE roles_permissions (
            role_id INTEGER NOT NULL,
            permission_id INTEGER NOT NULL,
            PRIMARY KEY (role_id, permission_id),
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
            FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
        );
        """
    )

    await connection.execute(
        """
        INSERT INTO roles (name) VALUES ('Finance');
        """
    )

    await connection.execute(
        """
        INSERT INTO permissions (name) VALUES ('View Invoice');
        """
    )

    await connection.execute(
        """
        INSERT INTO roles_permissions (role_id, permission_id)
        VALUES (
            (SELECT id FROM roles WHERE name = 'Finance'),
            (SELECT id FROM permissions WHERE name = 'View Invoice')
        );
        """
    )

    await connection.execute(
        """
        INSERT INTO collections (id, name, description, featured_image, team_id, tags, parent_id)
        VALUES 
          (1, 'Jan 2018',
              'Drafting for the Winter collection for 2018',
              'https://cdn.britannica.com/41/3341-050-825E2B57/The-Creation-of-Adam-ceiling-fresco-Sistine.jpg',
              1,
              'Sneakers, Vintage',
              NULL),
          (2, 'Fall 2024',
              'Drafting for the fall 2024 collection',
              'https://images.squarespace-cdn.com/content/v1/577e85abc534a5d5bcf943d2/1472153172370-JYVTR0APODH1QL9QQXF2/image-asset.jpeg',
              2,
              'Gear, Outdoors',
              NULL),
          (3, 'Ideas',
              'A dump of all my worst ideas',
              'https://static01.nyt.com/images/2017/05/18/arts/19basquiat_web1/18BASQUIAT-superJumbo.jpg',
              1,
              NULL,
              1),
         (4, 'London Aesthetics',
              'A collection of feelins and thoughts that remind of the streets of London',
              'https://i.pinimg.com/736x/b8/1f/8f/b81f8fe782c1e62304dbb39ee4a4ca90.jpg',
              1,
              'Elegant, Urban',
              NULL),
        (5, 'Movies I wish I could see again',
              'Quotes, Scenes, from my favorite films',
              'https://i.pinimg.com/736x/b2/78/1c/b2781ce8e802a8606aeb25ce1b1b0f21.jpg',
              1,
              NULL,
              NULL),
        (6, 'Denis Villeneuve',
              'Denis Villeneuve Cinematography',
              'https://i.pinimg.com/736x/86/96/0a/86960ab6b750beccf2d669adc13e817c.jpg',
              1,
              'Elegant, Urban',
              5);
        """
    )

    await connection.execute(
        """
        INSERT INTO content (title, artist, medium, year, image_url, collection_id)
        VALUES 
          ('Artwork Title 1', 'Artist 1', 'Art', 2020,
              'https://i.pinimg.com/736x/c1/6c/87/c16c87fb472280baede8e2e9ed0853b7.jpg', 1),
          ('Artwork Title 2', 'Artist 2', 'Art', 2020,
              'https://i.pinimg.com/736x/c2/c3/d4/c2c3d47595e74f612b549605971933b4.jpg', 1),
          ('Artwork Title 3', 'Artist 3', 'Art', 2020,
              'https://i.pinimg.com/736x/16/82/c7/1682c7a9d335f1f0c23a493f08c42cf7.jpg', 1),
          ('Artwork Title 4', 'Artist 4', 'Art', 2020,
              'https://i.pinimg.com/736x/11/e2/04/11e2044a3b5c1585d6a6f6e6b176f018.jpg', 2),
          ('Artwork Title 5', 'Artist 5', 'Art', 2020,
              'https://i.pinimg.com/736x/60/f5/1f/60f51f5f46b84aaee388b14d3f8ee1d9.jpg', 2),
          ('Artwork Title 6', 'Artist 6', 'Art', 2020,
              'https://i.pinimg.com/736x/12/2b/eb/122bebc31ef7860132b35e9d4fdb9e85.jpg', 1),
        ('Artwork Title 7', 'Artist 6', 'Art', 2020,
              'https://i.pinimg.com/736x/86/96/0a/86960ab6b750beccf2d669adc13e817c.jpg', 1);
        """
    )

    await connection.execute(
        """
        INSERT INTO content (title, artist, medium, year, image_url, collection_id)
        VALUES 
          ('Photography Title 1', 'Photographer 1', 'Photography', 2020,
              'https://i.pinimg.com/736x/f3/2e/dd/f32edd0f29a78c0eba464c50475de8e1.jpg', 1),
          ('Photography Title 2', 'Photographer 2', 'Photography', 2020,
              'https://i.pinimg.com/736x/cf/18/01/cf1801fc610e1969e7e674a43b9ba44a.jpg', 2),
          ('Photography Title 3', 'Photographer 3', 'Photography', 2020,
              'https://i.pinimg.com/736x/95/ce/ab/95ceabdd40d4f5692f5c20efd96349fa.jpg', 1),
          ('Photography Title 4', 'Photographer 4', 'Photography', 2020,
              'https://i.pinimg.com/736x/ab/be/3c/abbe3ca4d61ad2032d1a9c1a87d24a0e.jpg', 2),
          ('Photography Title 5', 'Photographer 5', 'Photography', 2020,
              'https://i.pinimg.com/736x/08/d1/97/08d1974dc0805a1949375439093da114.jpg', 1),
         ('Photography Title 6', 'Denis', 'Photography', 2020,
              'https://i.pinimg.com/736x/86/96/0a/86960ab6b750beccf2d669adc13e817c.jpg', 6),
        ('Photography Title 7', 'Denis', 'Photography', 2020,
              'https://i.pinimg.com/736x/2b/9c/7d/2b9c7d52f1bd0473a103468190faddea.jpg', 6),
        ('Photography Title 8', 'Denis', 'Photography', 2020,
              'https://i.pinimg.com/736x/45/26/77/45267774c045114a5656bd8debcf25b8.jpg', 6),
        ('Photography Title 9', 'Bruiser', 'Photography', 2020,
              'https://i.pinimg.com/736x/61/c4/83/61c483570ac7a00f1458596ea2546ba6.jpg', 5),
        ('Photography Title 10', 'Bond', 'Photography', 2020,
              'https://i.pinimg.com/736x/d2/f6/3e/d2f63ef35898aecbc725c28f8b7065ba.jpg', 5),
        ('Photography Title 11', 'Bond', 'Photography', 2020,
              'https://i.pinimg.com/736x/fa/97/39/fa9739b69b434461d1f862cd41de1156.jpg', 5);
            
        """
    )


async def valid_migration(connection):
    return True
