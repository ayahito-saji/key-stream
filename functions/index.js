const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.updateRoom = functions.firestore.document('/rooms/{roomId}').onUpdate((change, context) => {
  const room = change.after.data();
  const room_old = change.before.data();

  // 新しく招待したユーザーに通知を送る
  const newInvitedUserId = room.invitedUsers.filter((invitedUser)=>{ return room_old.invitedUsers.indexOf(invitedUser) === -1 })[0]
  if (newInvitedUserId) {
    console.log("ユーザーの招待", newInvitedUserId)
    console.log(room)
    db.doc('/users/'+newInvitedUserId).get().then((snapshot) => {
      const newInvitedUser = snapshot.data()
      console.log(newInvitedUser)

      if (newInvitedUser.pushTokens && newInvitedUser.pushTokens[0]) {
        const payload = {
          notification: {
            title: "「"+room.displayName+"」に招待されました",
            click_action: "https://key-stream.firebaseapp.com/"+context.params.roomId
          }
        };

        const option = {
          priority: "high"
        };

        for (const pushToken of newInvitedUser.pushTokens) {
          admin.messaging().sendToDevice(pushToken, payload, option);
        }
      }
    });
  }
  return 0;
})
