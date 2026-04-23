const getUsers = (req, res) => {
  res.json([{ id: 1, name: "John" }]);
};

const getAdmin = (req, res) => {
  res.json({name: "Rup"})
}

export { getUsers, getAdmin }