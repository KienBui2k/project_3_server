import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export default {
    create: async function (newUser) {
        try {
            await prisma.users.create({
                data: newUser
            })

            return {
                status: true,
                message: "Register thành công!",
            }
        } catch (err) {
            if (err.meta?.target == "users_email_key") {
                try {
                    let user = await prisma.users.findUnique({
                        where: {
                            email: newUser.email,
                            email_confirm: false
                        }
                    })
                    if (!user) {
                        return {
                            status: false,
                            message: "Email đã tồn tại!"
                        }
                    } else {
                        let nowDay = new Date(Date.now());
                        let flag = false;
                        if (nowDay.getFullYear() == user.create_at.getFullYear()
                            && nowDay.getMonth() == user.create_at.getMonth()
                            && nowDay.getDay() == user.create_at.getDay()
                        ) {
                            if (nowDay.getHours() == user.create_at.getHours()) {
                                if (nowDay.getMinutes() - user.create_at.getMinutes() > 5) {
                                    flag = true;
                                } else {
                                    return {
                                        status: false,
                                        message: `Email đã tồn tại nhưng chưa được kích hoạt, sau ${5 - (nowDay.getMinutes() - user.create_at.getMinutes())} phút thử đăng ký lại!`
                                    }
                                }
                            } else {
                                flag = true;
                            }
                        } else {
                            flag = true;
                        }

                        if (flag) {
                            try {


                                await prisma.users.update({
                                    where: {
                                        email: newUser.email
                                    },
                                    data: {
                                        email: `${Date.now() * Math.random()}@fakemail.com`
                                    }
                                })

                                return await this.create(newUser);
                            } catch (err) {
                                // xuất file log

                                return {
                                    status: false,
                                    message: "Email đã tồn tại!"
                                }
                            }
                        }
                    }
                } catch (err) {
                    return {
                        status: false,
                        message: "Hệ thống bận, thử lại sau!"
                    }
                }
            }
            return {
                status: false,
                message: "Đăng ký thất bại!"
            }
        }
    },
    confirm: async (data) => {
        try {
            let user = await prisma.users.update({
                where: {
                    email: data.email
                },
                data: {
                    email_confirm: true
                }
            })

            return {
                status: true,
                message: "Confirm email thành công!",
                data: user
            }
        } catch (err) {
            return {
                status: false,
                message: "Đang"
            }
        }
    },
    login: async (loginData) => {

        try {
            let user = await prisma.users.findUnique({
                // 1: user_name, 0: email
                where: loginData.type ? { user_name: loginData.user_name } : { email: loginData.user_name, email_confirm: true }
            })
            if (!user) {
                return {
                    status: false,
                    message: "Không tìm thấy người dùng!",
                }
            }
            return {
                status: true,
                message: "Thông tin người dùng!",
                data: user
            }
        } catch (err) {
            return {
                status: false,
                message: "Không tìm thấy người dùng!"
            }
        }
    },
    update: async (data) => {
        try {
            let user = await prisma.users.update({
                where: {
                    user_name: data.user_name
                },
                data: {
                    password: data.password,
                    update_at: new Date(Date.now())
                }
            })

            return {
                status: true,
                message: "Update thành công!"
            }
        } catch (err) {
            return {
                status: false,
                message: "Lỗi gì đó!"
            }
        }
    },
    findById: async (userId) => {
        try {
            const updateAt = await prisma.users.findUnique({
                where: {
                    id: userId
                },
                select: {
                    update_at: true
                }

            })

            if (updateAt) {
                return {
                    status: true,
                    messsage: "Tìm kiếm thành công user",
                    update_at: updateAt?.update_at
                }
            } else {
                return {
                    status: true,
                    messsage: "Tìm kiếm thất bại ",
                    data: null
                }
            }


        } catch (err) {

            return {
                status: false,
                messege: "lỗi"

            }

        }

    },
    findAllUsers: async () => {
        try {
            let users = await prisma.users.findMany({
                where: {
                    role: "ADMIN"
                }
            })
            return {
                message: "get all user thanh cong",
                data: users
            }
        } catch (err) {
            console.log("err", err);
            return {
                status: false,
                message: "get all user that bai"
            }
        }
    },
}