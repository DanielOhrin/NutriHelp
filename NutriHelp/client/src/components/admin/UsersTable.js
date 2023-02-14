import { useCallback, useEffect, useState } from "react"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, Input, Label, Table } from "reactstrap"
import { adminGetUsers } from "../../modules/userProfileManager"
import Pagination from "../helpers/Pagination"
import UserRow from "./UserRow"
import "./usersTable.css"

const UsersTable = () => {
    const [users, setUsers] = useState([{}]),
        [offset, setOffset] = useState(0),
        [total, setTotal] = useState(0),
        [increment, setIncrement] = useState(10),
        [isActive, setIsActive] = useState(true),
        [dropdownOpen, setDropdownOpen] = useState(false),
        [newIncrement, setNewIncrement] = useState(10)

    const resetState = useCallback(() => {
        adminGetUsers(increment, offset, isActive).then(data => { setUsers(data.userProfiles); setTotal(data.total) })
    }, [increment, offset, isActive])

    useEffect(() => {
        resetState()
    }, [resetState])

    return (
        <article id="users-table">
            <h2>User Profiles</h2>
            <Form className="d-flex" onSubmit={(e) => { e.preventDefault(); setIncrement(parseInt(document.querySelector(`input[name="increment"]`).value)) }}>
                <Label className="align-self-center" for="increment">Amount per page</Label>
                <Input className="w-auto mx-2" type="number" name="increment" min={1} value={newIncrement}
                    onChange={(e) => isFinite(e.target.value) && !isNaN(e.target.value) && e.target.value.trim() !== "" && setNewIncrement(parseInt(e.target.value))} />
                <Button>Update</Button>
            </Form>
            <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)} direction={"down"}>
                <DropdownToggle caret color="primary">Status Filter</DropdownToggle>
                <DropdownMenu>
                    <DropdownItem onClick={() => setIsActive(true)}>Active</DropdownItem>
                    <DropdownItem onClick={() => setIsActive(false)}>Not Active</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(p => <UserRow key={`user--${p.id}`} profile={p} resetState={resetState} isActive={isActive} />)}
                </tbody>
            </Table>
            <Pagination total={total} increment={increment} offset={offset} setOffset={setOffset} />
            <div>{offset + 1} - {offset + increment > total ? total : offset + increment} of {total}</div>
        </article>
    )
}

export default UsersTable