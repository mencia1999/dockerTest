const Loan = require("../models/Loan");
const Book = require("../models/Book");
const fetch = require("node-fetch");

class LoanController {
  /**
   * @route POST /api/loan/createLoan
   */
  createLoan = async (req, res) => {
    const { book, reader } = req.body;
    try {
      const foundLoan = await Loan.findOne({ book });
      if (foundLoan) {
        res.status(400).send("This book is already loaned by a reader");
      } else {
        const newLoan = new Loan({
          book,
          reader,
        });
        // await fetch(`http://localhost:5000/api/book/updateBook/${book}`, {
        //   method: "put",
        //   body: {
        //     available: false,
        //   },
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });
        const loan = await newLoan.save();
        res.status(201).send(loan);
      }
    } catch (err) {
      res.status(404).send("Something went wrong");
      console.log(err);
    }
  };
  /**
   * @route PUT /api/loan/updateLoan
   * @param {number} id
   */
  updateLoan = async (req, res) => {
    const { id } = req.params;
    const { book, reader } = req.body;
    try {
      await Loan.findByIdAndUpdate(
        id,
        {
          book,
          reader,
        },
        { useFindAndModify: false }
      ).then((res) => {
        res.status(200).send("updated loan");
      });
    } catch (err) {
      res.status(404).send("Something went wrong");
    }
  };
  /**
   * @route DELETE /api/loan/deleteLoan
   * @param {number} id
   */
  deleteLoan = async (req, res) => {
    const { id } = req.params;
    try {
      const loan = await Loan.findByIdAndDelete(id);
      if (!loan) res.status(400).send("Can't delete the loan");
      res.status(200).send("deleted");
    } catch (err) {
      res.status(404).send("Something went wrong");
      console.log({ err });
    }
  };
  /**
   * @route GET /api/loan/fetchAll
   */
  fetchAll = async (req, res) => {
    try {
      const loans = await Loan.find()
        .populate("book", "designation author image")
        .populate("reader", "name");
      res.status(200).send(loans);
    } catch (err) {
      res.status(404).send("Something went wrong");
      console.error({ err });
    }
  };
  /**
   * @route GET /api/loan/:id
   * @param {number} id
   */
  loan = async (req, res) => {
    const { id } = req.params;
    try {
      const loan = await Loan.findOne({ _id: id })
        .populate("book", "designation author publishingDate available")
        .populate("reader", "name");
      if (!loan) {
        res.status(400).send("Can't find the loan");
      } else {
        res.status(200).send(loan);
      }
    } catch (err) {
      res.status(404).send("Something went wrong");
    }
  };
}

module.exports.LoanController = LoanController;
