import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin',
        email: 'admin@iam.com',
        password: bcrypt.hashSync('12345',10),
        isAdmin: true
    },
    {
        name: 'Ayush Goyal',
        email: 'ayush@iam.com',
        password: bcrypt.hashSync('12345',10),
    },
    {
        name: 'Micheal jonas',
        email: 'micheal@iam.com',
        password: bcrypt.hashSync('12345',10),
    }
]

export default users