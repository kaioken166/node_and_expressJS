const users = [
    { id: 1, name: 'Tri', email: 'tri@gmail.com', password: '123456' },
    { id: 2, name: 'Trung', email: 'trung@gmail.com', password: '123456' },
    { id: 3, name: 'Toan', email: 'toan@gmail.com', password: '123456' }
];

const authController = {
    login: (req, res) => {
        res.render('login'); // Hiển thị trang đăng nhập
    },

    postLogin: (req, res) => {
        const { email, password } = req.body;

        // Xử lý đăng nhập
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            req.session.userId = user.id;
            return res.redirect('/profile');
        } else {
            return res.redirect('/login');
        }
    },
    register: (req, res) => {
        // Đoạn mã xử lý khi người dùng truy cập /auth/register
        res.render('register'); // Ví dụ sử dụng EJS template
    },

    postRegister: (req, res) => {
        // Đoạn mã xử lý khi người dùng submit form register
        const { name, email, password } = req.body;

        if (name && email && password) {    //TODO: validation
            const existed = users.some(user => user.email === email)

            if (!existed) {
                const user = {
                    id: users.length + 1,
                    name,
                    email,
                    password, // TODO: hash
                }
                users.push(user)

                req.session.userId = user.id

                return res.redirect('/profile')
            }
        }
        return res.redirect('/register')   //TODO: error message
    },
};

module.exports = authController;
