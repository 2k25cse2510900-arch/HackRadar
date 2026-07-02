const alertService = require("../services/alert.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const listAlerts = asyncHandler(async (req, res) => {
  const alerts = await alertService.listAlerts(req.user._id);

  res.status(200).json(
    new ApiResponse(
      200,
      alerts,
      "Alerts fetched successfully"
    )
  );
});

const createAlert = asyncHandler(async (req, res) => {
  const alert = await alertService.createAlert(
    req.user._id,
    req.body
  );

  res.status(201).json(
    new ApiResponse(
      201,
      alert,
      "Alert created successfully"
    )
  );
});

const updateAlert = asyncHandler(async (req, res) => {
  const alert = await alertService.updateAlert(
    req.user._id,
    req.params.id,
    req.body
  );

  res.status(200).json(
    new ApiResponse(
      200,
      alert,
      "Alert updated successfully"
    )
  );
});

const deleteAlert = asyncHandler(async (req, res) => {
  await alertService.deleteAlert(
    req.user._id,
    req.params.id
  );

  res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Alert deleted successfully"
    )
  );
});

module.exports = {
  listAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
};