import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default {
    findByCategory: async function (category_id) {
        try {
            let products = await prisma.products.findMany({
                where: {
                    category_id: category_id,
                    active: true
                }
            });
            return {
                message: "Get products success!",
                data: products
            }
        } catch (err) {
            return {
                status: false,
                message: "Lỗi không xác định!"
            }
        }
    },
    findAll: async () => {
        try {
            let categories = await prisma.categories.findMany()
            return {
                status: true,
                message: "get all product thanh cong",
                data: categories
            }
        } catch (err) {

            return {
                status: false,
                message: "get all product that bai"
            }
        }
    },
    findLatestProductsByCategory: async function (category_id) {
        try {
            let products = await prisma.products.findMany({
                where: {
                    category_id: category_id,
                    active: true
                },
                orderBy: {
                    create_at: 'desc'
                },
                take: 1
            });

            return {
                message: "Get latest products success!",
                data: products
            };
        } catch (err) {
            console.log("err", err);
            return {
                status: false,
                message: "Lỗi không xác định!"
            };
        }
    },

}