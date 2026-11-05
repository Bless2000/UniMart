import pool from '../config/db.js';
import listings from './tables/listings.js';
import offers from './tables/offers.js';
import reviews from './tables/reviews.js';
import conversations from './tables/conversations.js';
import messages from './tables/messages.js';
import orders from './tables/orders.js';
import wallets from './tables/wallets.js';
import users from './tables/users.js';
import categories from './tables/categories.js';
import disputes from './tables/disputes.js';
import walletTransactions from './tables/wallet_transactions.js';

async function initializeDatabase() {

            // We want to acquire a single client from the pool to run our transactions/queries
            const client = await pool.connect();
                
            try {
                console.log('Initializing database...');

                 // TODO: If you want a fresh database reset every time, you could run 
                // DROP TABLE IF EXISTS queries here in reverse-dependency order.
                    const dropTablesQuery = `
                        DROP TABLE IF EXISTS wallet_transactions CASCADE;
                        DROP TABLE IF EXISTS disputes CASCADE;
                        DROP TABLE IF EXISTS reviews CASCADE;
                        DROP TABLE IF EXISTS messages CASCADE;
                        DROP TABLE IF EXISTS offers CASCADE;
                        DROP TABLE IF EXISTS conversations CASCADE;
                        DROP TABLE IF EXISTS orders CASCADE;
                        DROP TABLE IF EXISTS listings CASCADE;
                        DROP TABLE IF EXISTS wallets CASCADE;
                        DROP TABLE IF EXISTS users CASCADE;
                        DROP TABLE IF EXISTS categories CASCADE;
                    `;

                await client.query(dropTablesQuery);

                // TODO: Execute table queries in the correct order using:
            // await client.query(users);
                const createTablesQuery = `
                    ${users}
                    ${categories}
                    ${wallets}
                    ${listings}
                    ${walletTransactions}
                    ${conversations}
                    ${offers}
                    ${orders}
                    ${messages}
                    ${reviews}
                    ${disputes}
                `;

                await client.query(createTablesQuery);

                console.log('Database initialized successfully.');
            } catch (error) {
                console.error('Error initializing database:', error);
            } finally {
                client.release();

                await pool.end();
            }
}

initializeDatabase();

