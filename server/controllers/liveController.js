const LivePermission = require("../models/livePermissionModel");
const LiveSession = require("../models/liveSessionModel");

exports.requestLivePermission = async (req, res) => {
  try {
    const existing = await LivePermission.findOne({
      vendorUser: req.user._id,
      status: "Pending",
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending live permission request",
      });
    }

    const permission = await LivePermission.create({
      vendorUser: req.user._id,
      note: req.body.note || "",
    });

    res.status(201).json({
      success: true,
      message: "Live permission request submitted",
      permission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLivePermissions = async (req, res) => {
  try {
    const permissions = await LivePermission.find()
      .populate("vendorUser", "fullName email phone role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      permissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateLivePermission = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const permission = await LivePermission.findByIdAndUpdate(
      req.params.id,
      {
        status,
        approvedBy: req.user._id,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: `Permission ${status}`,
      permission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.startLive = async (req, res) => {
  try {
    const { title, streamUrl } = req.body;

    if (!title || !streamUrl) {
      return res.status(400).json({
        success: false,
        message: "Title and stream URL are required",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isVendor = req.user.role === "vendor";

    if (!isAdmin && !isVendor) {
      return res.status(403).json({
        success: false,
        message: "Only admin or vendor can start live",
      });
    }

    if (isVendor) {
      const permission = await LivePermission.findOne({
        vendorUser: req.user._id,
        status: "Approved",
      });

      if (!permission) {
        return res.status(403).json({
          success: false,
          message: "You need admin permission to start live",
        });
      }
    }

    const live = await LiveSession.create({
      host: req.user._id,
      title,
      streamUrl,
      hostType: req.user.role,
      status: "Live",
    });

    res.status(201).json({
      success: true,
      message: "Live started",
      live,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.endLive = async (req, res) => {
  try {
    const live = await LiveSession.findByIdAndUpdate(
      req.params.id,
      { status: "Ended" },
      { new: true }
    );

    res.json({
      success: true,
      message: "Live ended",
      live,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getActiveLives = async (req, res) => {
  try {
    const lives = await LiveSession.find({ status: "Live" })
      .populate("host", "fullName email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      lives,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};