const orders = `

    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TYPE IF EXISTS orders_status CASCADE;
    DROP TYPE IF EXISTS resolution_outcome_enum CASCADE;
    DROP TYPE IF EXISTS payment_method_enum CASCADE;
    CREATE TYPE orders_status AS ENUM ('pending_payment', 'processing', 'dispatched', 'delivered', 'completed', 'disputed', 'refund_flagged', 'cancelled');
    CREATE TYPE resolution_outcome_enum AS ENUM ('buyer_favour', 'seller_favour', 'dismissed');
    CREATE TYPE payment_method_enum AS ENUM ('cod', 'paystack');

    CREATE TABLE IF NOT EXISTS orders(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
      payment_method payment_method_enum NOT NULL,
      agreed_price DECIMAL (10, 2) NOT NULL,
      commission_rate DECIMAL (5, 2) NOT NULL,
      commission_amount DECIMAL (10, 2) NOT NULL,
      seller_payout DECIMAL (10, 2) NOT NULL,
      status orders_status NOT NULL DEFAULT 'pending_payment',
      paystack_ref VARCHAR(100),
      dispatched_at TIMESTAMP,
      delivered_at TIMESTAMP,
      completed_at TIMESTAMP,
      resolution_outcome resolution_outcome_enum,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP      
    );

`;

export default orders;
