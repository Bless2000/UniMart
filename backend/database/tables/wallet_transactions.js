const wallet_transactions = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TYPE IF EXISTS transaction_type CASCADE;
    CREATE TYPE transaction_type AS ENUM ('credit', 'debit', 'commission');


    CREATE TABLE IF NOT EXISTS wallet_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        type transaction_type NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

export default wallet_transactions;
