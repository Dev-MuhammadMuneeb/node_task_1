const express = require("express");
const router = express.Router();
const terminate_configuration = require("../../models/terminate_configuration");
const Sequelize = require("sequelize");
const helpers = require("../../core/helpers");
let SessionService = require("../../services/SessionService");

const Op = Sequelize.Op;

const role = 1;

router.get(
  "/admin/terminateConfiguration",
  SessionService.verifySessionMiddleware(role, "admin"),
  async function (req, res, next) {
    try {
      let session = req.session;
      let paginateListViewModel = require("../../view_models/terminate_configuration_admin_view_model");

      var viewModel = new paginateListViewModel(
        db.terminate_configuration,
        "terminate_configuration",
        session.success,
        session.error,
        "/admin/terminateConfiguration"
      );

      const format = req.query.format ? req.query.format : "view";
      const direction = req.query.direction ? req.query.direction : "ASC";
      const per_page = req.query.per_page ? req.query.per_page : 10;
      // req.query.order_by ? req.query.order_by :
      let order_by = [
        ["quiz_id", direction],
        ["order", direction],
      ];
      // Check for flash messages
      const flashMessageSuccess = req.flash("success");
      if (flashMessageSuccess && flashMessageSuccess.length > 0) {
        viewModel.success = flashMessageSuccess[0];
      }
      const flashMessageError = req.flash("error");
      if (flashMessageError && flashMessageError.length > 0) {
        viewModel.error = flashMessageError[0];
      }

      viewModel.set_id(req.query.id ? req.query.id : "");
      viewModel.set_quiz_id(req.query.quiz_id ? req.query.quiz_id : "");
      viewModel.set_type(req.query.type ? req.query.type : "");

      let where = helpers.filterEmptyFields({
        id: viewModel.get_id(),
        quiz_id: viewModel.get_quiz_id(),
        type: viewModel.get_type(),
      });

      const count = await db.terminate_configuration._count(where, [
        {
          model: db.terminate_configuration,
          as: "terminate_configuration",
          required: true,
        },
      ]);

      viewModel.set_total_rows(count);
      viewModel.set_per_page(+per_page);
      viewModel.set_page(+req.params.num);
      viewModel.set_query(req.query);
      viewModel.set_sort_base_url(
        `/admin/terminateConfiguration/${+req.params.num}`
      );
      viewModel.set_sort(direction);

      const list = await db.question.getPaginatedV2(
        viewModel.get_page() - 1 < 0 ? 0 : viewModel.get_page(),
        viewModel.get_per_page(),
        where,
        order_by,
        direction,
        [
          {
            model: db.terminate_configuration,
            as: "terminate_configuration",
            required: true,
          },
        ]
      );

      viewModel.set_list(list);

      viewModel.quiz = await db.quiz;

      if (format == "csv") {
        const csv = viewModel.to_csv();
        return res
          .set({
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="export.csv"',
          })
          .send(csv);
      }
      return res.render("admin/terminate_configuration", viewModel);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  }
);
module.exports = router;
