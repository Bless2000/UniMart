const messages = `

    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TYPE IF EXISTS messages_status CASCADE;
    CREATE TYPE messages_status AS ENUM ('text', 'offer');

    CREATE TABLE IF NOT EXISTS messages(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type messages_status NOT NULL DEFAULT 'text',
        body TEXT,
        offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

export default messages;
