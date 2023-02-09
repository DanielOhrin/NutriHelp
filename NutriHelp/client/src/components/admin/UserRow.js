import { useCallback, useState } from "react"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { activateUser, deactivateUser } from "../../modules/userProfileManager"

const UserRow = ({ profile, resetState, isActive }) => {
    const [modal, setModal] = useState(false)

    const confirmDeactivate = useCallback(() => { deactivateUser(profile.id).then(res => res.ok && resetState()) }, [resetState, profile])

    const confirmActivate = useCallback(() => { activateUser(profile.id).then(res => res.ok && resetState()) }, [resetState, profile])

    return (
        <tr>
            <td className="col-2">{profile.id}</td>
            <td>{profile.firstName} {profile.lastName}</td>
            <td>{profile.email}</td>
            <td>
                {
                    isActive === 1
                        ? <>
                            <Button color="danger" onClick={() => setModal(!modal)}>Deactivate</Button>
                            <Modal isOpen={modal} toggle={() => setModal(!modal)}>
                                <ModalHeader toggle={() => setModal(!modal)}>Confirmation</ModalHeader>
                                <ModalBody>Are you sure you want to deactivate {profile.email}?</ModalBody>
                                <ModalFooter>
                                    <Button onClick={() => setModal(!modal)} color="secondary">Cancel</Button>
                                    <Button onClick={() => confirmDeactivate()} color="primary">Confirm</Button>
                                </ModalFooter>
                            </Modal>
                        </> : <>
                            <Button color="warning" onClick={() => setModal(!modal)}>Activate</Button>
                            <Modal isOpen={modal} toggle={() => setModal(!modal)}>
                                <ModalHeader toggle={() => setModal(!modal)}>Confirmation</ModalHeader>
                                <ModalBody>Are you sure you want to re-activate {profile.email}?</ModalBody>
                                <ModalFooter>
                                    <Button onClick={() => setModal(!modal)} color="secondary">Cancel</Button>
                                    <Button onClick={() => confirmActivate()} color="primary">Confirm</Button>
                                </ModalFooter>
                            </Modal>
                        </>
                }
            </td>
        </tr>
    )
}

export default UserRow