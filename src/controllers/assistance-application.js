import Users from '~/src/models/users'
// import {NotificationTrigger} from '~/src/utils'
// var io = require('socket.io')(3000)

// Ejecutar funcion de enviar notificacion
// var notificatePush = new NotificationTrigger(io)
// notificatePush.connect()

const debug = require('debug')('assistance-service:controllers:Assistance')

class AssistanceOverview {
  checkQR (req, res) {
    let codeQR = req.body.codeQR

    Users.findOne({'_id': codeQR}, (err, user) => {
      if (err) {
        return res.status(404).json({
          status: 'not_found',
          message: 'Código QR no válido'
        })
      }

      if (user !== null) {
        // si el usuario fue encontrado
        if (user.statusConnect === false) {
          // cambiar su estado a true
          user.statusConnect = true
          user.horaEntrada = new Date()

          user.save((err, userSaved) => {
            if (err) {
              return debug(err)
            }

            // Evento socket.io
            // notificatePush.notificar(userSaved)

            res.status(200).json({
              status: 'new_check',
              message: 'QR OK - ¡Usuario Check!'
            })
          })
        } else {
          res.status(200).json({
            status: 'user_checked',
            message: 'El usuario ya esta marcado'
          })
        }
      } else {
        res.status(404).json({
          status: 'not_found',
          message: 'Código QR no válido'
        })
      }
    })
  }

  reset (req, res) {
    Users.find((err, users) => {
      if (err) {
        return debug(err)
      }

      for (var i = 0; i <= users.length - 1; i++) {
        users[i].statusConnect = false
        users[i].save((err, result) => {
          if (err) {
            return debug(err)
          }
        })
      }

      res.status(200).json({
        status: 'users - code QR - reset'
      })
    })
  }
}

export default AssistanceOverview
