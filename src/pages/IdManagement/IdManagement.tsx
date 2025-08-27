import { AccountManagement } from "../../components/management/AccountManagement"
import { MyIDsTable } from "../../components/management/MyIDsTable"
import { TopPerforming } from "../../components/management/TopPerforming"

export const IdManagement = () => {
  return (
    <div className="px-8 py-[34px] w-full bg-[#F4F6F9FF]">
      <AccountManagement />
      <TopPerforming />
      <MyIDsTable />
    </div>
  )
}