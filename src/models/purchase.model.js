import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export default {
    addToCart: async function (user_id, cart_detail_record) {
        try {

            /* case 
                1. user chưa từng mua hàng => cart chưa từn tồn tại 
                2. user đã từng mua hàng 
                    - cart đã có
                       + đã có sản phẩm 
                       + chưa có sản phẩm 
                            => cộng dồn quantity theo product id

            */
            let existCart = await prisma.carts.findUnique({
                where: {
                    user_id
                }
            })
            if (existCart) {
                /* Đã có giỏ hàng */
                let existProductInCart = await prisma.cart_details.findMany({
                    where: {
                        AND: [
                            {
                                cart_id: existCart.id
                            },
                            {
                                product_id: Number(cart_detail_record.product_id)
                            }
                        ]
                    }
                })

                if (existProductInCart.length != 0) {
                    // sản phẩm đã tồn tại trong carts
                    await prisma.cart_details.update({
                        where: {
                            id: existProductInCart[0].id
                        },
                        data: {
                            quantity: (cart_detail_record.quantity + existProductInCart[0].quantity),
                            note: (existProductInCart[0].note + "," + cart_detail_record.note)
                        }
                    })

                    return {
                        status: true,
                        message: "Thêm sản phẩm vào giỏ hàng thành công!"
                    }
                } else {
                    // chưa từng
                    await prisma.cart_details.create({
                        data: {

                            cart_id: existCart.id,
                            ...cart_detail_record
                        }
                    })
                    return {
                        status: true,
                        message: "Thêm sản phẩm vào giỏ hàng thành công!"
                    }
                }
            } else {
                /* Không có giỏ hàng */
                await prisma.carts.create({
                    data: {
                        user_id,
                        cart_details: {
                            create: [
                                cart_detail_record
                            ]
                        },
                    }
                    // ,
                    // include: {
                    //     cart_details: true, // Include all posts in the returned object
                    // },
                })
                return {
                    status: true,
                    message: "Thêm sản phẩm vào giỏ hàng thành công!"
                }

            }
        } catch (err) {
   
            return {
                status: false,
                message: "Lỗi!"
            }
        }
    },
    findCart: async function (user_id) {
        try {
            let existCart = await prisma.carts.findUnique({
                where: {
                    user_id: user_id
                }
                ,
                include: {
                    cart_details: true,
                    cart_details: {
                        include: {
                            product: true
                        }
                    }
                }
            })
            return {
                status: true,
                message: "đã lấy đc cart!",
                data: existCart
            }
        } catch (err) {
   
            return {
                status: false,
                message: "Lỗi"
            }
        }
    },
    deleteProduct: async function (product_id) {
        try {
            let cartBeforeDele = await prisma.cart_details.delete({
                where: {
                    id: product_id
                }
            })
            return {
                status: true,
                message: "Delete Successfull!",
                data: cartBeforeDele
            }

        } catch (err) {
            return {
                status: false,
                message: "Delete Failed!"
            }


        }
    },
    updateCart: async function (data) {

        // type : 1 update,  0 delete, 
        try {

            if (data.type) {
                await prisma.cart_details.update({
                    where: {
                        id: data.cart_detail_record_edited.id
                    },
                    data: {
                        quantity: data.cart_detail_record_edited.quantity
                    }
                })
            } else {
                await prisma.cart_details.delete({
                    where: {
                        id: data.cart_detail_record_edited.id
                    }
                })
            }
            return {
                status: true,
                message: 'Updated Successfully'
            }
        } catch (err) {

            return {
                status: false,
                message: "Lỗi Modules"
            }
        }

    },
    createReceipt: async function (data) {
        try {
            let receipt = prisma.receipts.create({
                data: {
                    ...data.receiptInfor,
                    receipt_details: {
                        create: data.receiptDetails
                    },
                }
            })

            const deleteCartDetail = prisma.cart_details.deleteMany({
                where: {
                    cart_id: data.receiptInfor.receipt_code
                }
            })

            const deleteCart = prisma.carts.delete({
                where: {
                    id: data.receiptInfor.receipt_code,
                },
            })

            const transaction = await prisma.$transaction([receipt, deleteCartDetail, deleteCart])

            return {
                status: true,
                message: "Ok nhé",
                data: receipt
            }
        } catch (err) {
        
            return {
                status: false,
                message: "lỗi createReceipt model"
            }
        }
    }
}