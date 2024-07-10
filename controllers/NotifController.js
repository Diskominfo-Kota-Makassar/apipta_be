const db = require("../models");

exports.add = async (req, res) => {
  try {
    // Create new user
    const user = await db.Notif.create(req.body);
    res.status(201).json({ message: "Notif.", userId: user.id });
  } catch (error) {
    console.error("Notif Error:", error);
    res.status(500).json({ message: "Error registering new Notif." });
  }
};

exports.get = async (req, res) => {
  try {
    const Notif = await db.Notif.findAll({
      include: [
        {
          model: db.Penugasan,
          as: "penugasan",
        },
        {
          model: db.User,
          as: "users_pembuat",
        },
      ],
    });
    return res.status(200).json({ message: "Notif successful!", data: Notif });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.baca = async (req, res) => {
  const { id, id_user } = req.params;
  try {
    const notif = await db.Notif.findOne({
      where: { id: id },
    });

    if (notif) {
      let timIdArray = [];

      if (notif.user_id_baca) {
        try {
          // timIdArray = JSON.parse(notif.user_id_baca);
          for (const id of notif.user_id_baca) {
            timIdArray.push(id);
          }
          console.log("timIdArray");
          console.log(timIdArray);
        } catch (error) {
          console.error("Error parsing user_id_baca:", error);
          return res
            .status(400)
            .json({ message: "Invalid user_id_baca format" });
        }
      }

      // Ensure id_user is an integer and not already in the array
      const idUserInt = parseInt(id_user, 10);
      if (!timIdArray.includes(idUserInt)) {
        timIdArray.push(idUserInt);
      }

      // Convert timIdArray to a JSON string
      const updatedUserIdBaca = JSON.stringify(timIdArray);

      // Update user_id_baca with the new array
      await db.Notif.update(
        { user_id_baca: updatedUserIdBaca },
        {
          where: { id: id },
        }
      );

      return res
        .status(200)
        .json({ message: "Notif successfully read!", data: notif });
    } else {
      return res.status(404).json({ message: "Notif not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getByUser = async (req, res) => {
  const { id_user } = req.params;
  try {
    var notifRe = [];
    const Notif = await db.Notif.findAll({
      include: [
        {
          model: db.Penugasan,
          as: "penugasan",
        },
        {
          model: db.User,
          as: "users_pembuat",
        },
      ],
    });
    for (const data of Notif) {
      if (
        data.penugasan.pj_id == id_user ||
        data.penugasan.wpj_id == id_user ||
        data.penugasan.dalnis == id_user ||
        data.penugasan.kt_id == id_user
      ) {
        notifRe.push(data);
      } else if (data.penugasan.tim_id) {
        try {
          const timIdArray = JSON.parse(data.penugasan.tim_id);

          for (const id of timIdArray) {
            if (id_user == id) {
              notifRe.push(data);
            }
          }
        } catch (error) {
          console.error(
            `Failed to parse tim_id for data id: ${data.id}`,
            error
          );
        }
      }
    }
    return res
      .status(200)
      .json({ message: "Notif successful!", data: notifRe });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params; // assuming the Notif ID is passed as a URL parameter

  try {
    const [updated] = await db.Notif.update(req.body, {
      where: { id: id },
    });

    if (updated) {
      const updatedNotif = await db.Notif.findOne({ where: { id: id } });
      return res
        .status(200)
        .json({ message: "Notif updated successfully!", data: updatedNotif });
    }
    throw new Error("Notif not found");
  } catch (error) {
    console.error("Update Notif Error:", error);
    res.status(500).json({ message: "Error updating Notif." });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params; // assuming the Notif ID is passed as a URL parameter

  try {
    const notif = await db.Notif.findOne({ where: { id: id } });
    if (notif) {
      await notif.destroy();
      return res.status(200).json({ message: "Notif deleted successfully!" });
    }
    return res.status(404).json({ message: "Notif not found" });
  } catch (error) {
    console.error("Delete Notif Error:", error);
    res.status(500).json({ message: "Error deleting Notif." });
  }
};
