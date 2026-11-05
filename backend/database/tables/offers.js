const offers = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TYPE IF EXISTS offers_status CASCADE;
    CREATE TYPE offers_status AS ENUM ('pending', 'accepted', 'declined', 'superseded');

    CREATE TABLE IF NOT EXISTS offers(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        proposed_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        status offers_status NOT NULL DEFAULT 'pending',
        superseded_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

export default offers;
