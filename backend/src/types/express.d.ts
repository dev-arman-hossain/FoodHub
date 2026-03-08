// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user: {
                userId: string;
                role: string;
                email: string;
            };
        }
    }
}

export { };
