/* Routes: (include user should be logged guard in all)
    1. Get Router to fetch list.
    2. Participation Table Update  =  PUT request to update score and completed at. 
    3. Participation Table Update  =  PUT request to update userId once player clicks join game button after registering.   

*/

var express = require("express");
var router = express.Router();
const models = require("../models");
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn")

router.get("/", async function (req, res, next) {
    try {
        const participants = await models.Participant.findAll( {include: models.Game} );
        res.send(participants);
      } catch (error) {
        res.status(500).send(error);
      }
});

//  to create an endpoint to update a participant's play information
router.put('/participation/:id/play', async (req, res) => {
  const { id } = req.params;
  const { score, completedAt } = req.body;

  try {
    // Find the participant with the specified ID and include the associated Game with userId check
    const participant = await Participation.findOne({
      where: {
        id,
      },
      include: {
        model: Game,
        where: {
          userId: req.userID,
        },
      },
    });

    await participant.update({ score, completedAt });

    // Check if the participant is found
    if (!participant) {
      return res.status(404).send({ message: 'Participant not found' });
    }

    // Update the participant's score and completion date
    await participant.update({ score, completedAt });

    res.send(participant);
  } catch (err) {
    console.error('Error updating participation:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});
 
/*   shrudhi
    This route updates the userId for new players.
*/

router.put("/:participationId", userShouldBeLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId; // User ID extracted from the token

  try {
      // Update the userId in the participation table where it's currently null for the specified id
      const updatedParticipationCount = await models.Participation.update(
          { userId },
          { where: { id, userId: null } }
      );

      if (updatedParticipationCount === 0) {
          return res.status(400).send("No participation record found with null userId for this participation ID");
      }

      res.send("User ID updated successfully");
  } catch (error) {
      res.status(500).send(error);
  }
});

module.exports = router;

// post 
// router.post("/", async function (req, res, next) {
//     const { name } = req.body;
//     try {
//         const participants = await models.Participant.create( { name } );
//         res.send(participants);
//       } catch (error) {
//         res.status(500).send(error);
//       }
// });

// get one by id
// router.get("/:id", async function (req, res, next) {
//     const { id } = req.params;
//     try {
//         const participants = await models.Participant.findOne({
//             where: {
//               id,
//             },
//             include: models.Game,
//         });
//         res.send(participants);
//       } catch (error) {
//         res.status(500).send(error);
//       }
// });

// get all games by participant id

// router.get("/:id/games", async function (req, res, next) {
//     const { id } = req.params;
  
//     try {
//         const participants = await models.Participant.findOne({
//             where: {
//               id,
//             },
//         });

//         if (!participants) {
//             return res.status(404).send("Participant not found");
//         }
     
//         const games = await participants.getGames();

//         res.send(games);
//       } catch (error) {
//         res.status(500).send(error);
//       }
// });

