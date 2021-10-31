const { Thought, User } = require("../models");

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: "thoughts",
            select: "-__v",
        })
        .select("-__v")
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
        console.log(err);
        res.status(500).json(err);
        });
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: "thoughts",
            select: "-__v",
        })
        .populate({
            path: "friends",
            select: "-__v",
        })
        .select("-__v")
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    createUser({ body }, res) {
        User.create(body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(400).json(err));
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
        { _id: params.userId },
        { $addToSet: { friends: params.friendId } },
        { new: true, runValidators: true }
        )
        .then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: "No user found with this userId" });
            return;
        }
        User.findOneAndUpdate(
            { _id: params.friendId },
            { $addToSet: { friends: params.userId } },
            { new: true, runValidators: true }
        )
            .then((dbUserData2) => {
            if (!dbUserData2) {
                res
                .status(404)
                .json({ message: "No user found with this friendId" });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
},

    removeFriend({ params }, res) {
        User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true, runValidators: true }
        )
        .then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: "No user found with this userId" });
            return;
        }
        User.findOneAndUpdate(
            { _id: params.friendId },
            { $pull: { friends: params.userId } },
            { new: true, runValidators: true }
        )
        .then((dbUserData2) => {
            if (!dbUserData2) {
                res
                .status(404)
                .json({ message: "No user found with this friendId" });
                return;
            }
            res.json({ message: "Successfully deleted the friend" });
        })
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
},

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
    })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this ID!" });
                return;
            }
        res.json(dbUserData);
    })
    .catch((err) => res.json(err));
  },

  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this ID!" });
                return;
        }
        res.json(dbUserData);
    })
    .catch((err) => res.status(400).json(err));
  },
};

module.exports = userController;