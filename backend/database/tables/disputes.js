const disputes = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TYPE IF EXISTS disputes_status CASCADE;
    DROP TYPE IF EXISTS disputes_reason CASCADE;
    CREATE TYPE disputes_status AS ENUM ('open', 'resolved', 'dismissed');
    CREATE TYPE disputes_reason AS ENUM ('not_received', 'faulty', 'not_as_described', 'services_not_rendered', 'scam' ,'other');

    CREATE TABLE IF NOT EXISTS disputes(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        reason disputes_reason NOT NULL,
        refund_amount DECIMAL(10, 2) NOT NULL,
        resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
        resolution_notes TEXT,
        status disputes_status NOT NULL DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

export default disputes;
