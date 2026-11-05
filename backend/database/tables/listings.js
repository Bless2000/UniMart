const listings = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TYPE IF EXISTS listing_delivery_enum CASCADE;
    DROP TYPE IF EXISTS listing_status_enum CASCADE;
    CREATE TYPE listing_delivery_enum AS ENUM ('pickup', 'delivery', 'both');
    CREATE TYPE listing_status_enum AS ENUM ('active', 'sold', 'paused', 'removed');

    CREATE TABLE IF NOT EXISTS listings(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
        title VARCHAR(120) NOT NULL,
        description text NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        media_urls JSONB NOT NULL,
        delivery_type listing_delivery_enum NOT NULL,
        status listing_status_enum NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`

export default listings;
