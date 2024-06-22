const db = require("../models");
const bcryptjs = require("bcryptjs");

exports.save = async (req, res) => {
  try {
    const { no, penugasan_id, tim_id, penerima, pengirim, judul, isi } =
      req.body;
    const chat = await db.chat.create({
      no,
      penugasan_id,
      tim_id,
      penerima,
      pengirim,
      judul,
      isi,
    });
    res.status(201).send(chat);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error while creating chat", error: error.message });
  }
};

exports.getchat = async (req, res) => {
  try {
    const pengirim = req.params.pengirim;
    const chat = await db.chat.findOne({
      where: { pengirim: pengirim },
    });
    if (chat) {
      res.status(200).send(chat);
    } else {
      res.status(404).send({ message: "Chat not found" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error while retrieving the chat",
      error: error.message,
    });
  }
};
