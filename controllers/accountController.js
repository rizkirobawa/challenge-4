const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Error handling function
const handleError = (res, statusCode, message) => {
  return res
    .status(statusCode)
    .json({ status: false, message: message, data: null });
};

// User validate function
const validateUser = async (user_id) => {
  return prisma.user.findUnique({ where: { id: user_id } });
};

module.exports = {
  create: async (req, res, next) => {
    try {
      let { bank_name, bank_account_number, balance, user_id } = req.body;

      const existingUser = await validateUser(user_id);

      if (!existingUser) {
        return handleError(res, 404, `User with ID ${user_id} not found`);
      }

      const newBankAccount = await prisma.bankAccount.create({
        data: {
          bank_name,
          bank_account_number,
          balance,
          user: {
            connect: { id: user_id },
          },
        },
      });

      res.status(201).json({
        status: true,
        message: `Bank Account createad successfully`,
        data: newBankAccount,
      });
    } catch (error) {
      next(error);
    }
  },
  index: async (req, res, next) => {
    try {
      let accounts = await prisma.bankAccount.findMany();

      res.status(200).json({
        status: true,
        message: "OK",
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  },
  show: async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      let accounts = await prisma.bankAccount.findUnique({
        where: { id: id },
      });

      if (!accounts) {
        return handleError(res, 404, `Can't find account with ID ${id}`);
      }

      res.status(200).json({
        status: true,
        message: "OK",
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { bank_name, bank_account_number, balance } = req.body;

      let accounts = await prisma.bankAccount.update({
        where: { id: id },
        data: {
          bank_name: bank_name,
          bank_account_number: bank_account_number,
          balance: balance,
        },
      });

      if (!accounts) {
        return handleError(res, 404, `Account with ID ${id} not found`);
      }

      res.status(200).json({
        status: true,
        message: `Update account with ID ${id} successfully`,
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      let accounts = await prisma.bankAccount.findUnique({ where: { id: id } });

      if (!accounts) {
        return handleError(res, 404, `Account with ID ${id} not found`);
      }

      await prisma.bankAccount.delete({
        where: { id },
      });

      res.status(200).json({
        status: true,
        message: `Account with ID ${id} deleted successfully`,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
