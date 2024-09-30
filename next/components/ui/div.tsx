import { BriefcaseIcon, MapPinIcon, TreesIcon, HardHatIcon, GrapeIcon, UserIcon, ChurchIcon, UsersIcon, HandPlatterIcon, BuildingIcon, BoxIcon, BedIcon, WarehouseIcon, TruckIcon, MicroscopeIcon, HomeIcon } from '../ui/icon'

export function DivIconInfo({ children, iconType } : { children: string, iconType: string }) {
  return (
    <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
      <CustomIcon iconType={iconType} style="w-5 h-5 min-w-5 min-h-5 mr-2" />
      <span className='whitespace-nowrap'>{children}</span>
    </div>
  )
}

export function CustomIcon({ iconType, style }) {
  switch(iconType) {
    case 'BriefcaseIcon': return <BriefcaseIcon className={style} />
    case 'MapPinIcon': return <MapPinIcon className={style} />
    case 'TreesIcon': return <TreesIcon className={style} />
    case 'HardHatIcon': return <HardHatIcon className={style} />
    case 'GrapeIcon': return <GrapeIcon className={style} />
    case 'UserIcon': return <UserIcon className={style} />
    case 'ChurchIcon': return <ChurchIcon className={style} />
    case 'UsersIcon': return <UsersIcon className={style} />
    case 'HandPlatterIcon': return <HandPlatterIcon className={style} />
    case 'BuildingIcon': return <BuildingIcon className={style} />
    case 'BoxIcon': return <BoxIcon className={style} />
    case 'BedIcon': return <BedIcon className={style} />
    case 'WarehouseIcon': return <WarehouseIcon className={style} />
    case 'TruckIcon': return <TruckIcon className={style} />
    case 'HomeIcon': return <HomeIcon className={style} />
    default: return <MicroscopeIcon className={style} />
  }
}
