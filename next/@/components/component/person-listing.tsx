import { BriefcaseIcon, MapPinIcon, TreesIcon, HardHatIcon, GrapeIcon } from '../ui/icon'
import styles from '../../../styles/main.module.css'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from "../ui/button"

export function PersonListing({ personData, familyName = null, queryClient = null, userId = null }) {
  const  increaseFood  = useMutation({
    mutationFn: (id) => {
      return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/action', {
        action_person_id: id,
        action_type_id: 1
      })
    },
  })

  const  increaseWood  = useMutation({
    mutationFn: (id) => {
      return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/action', {
        action_person_id: id,
        action_type_id: 2
      })
    },
  })

  const increaseStorage = useMutation({
    mutationFn: (id) => {
      return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/action', {
        action_person_id: id,
        action_type_id: 3
      })
    },
  })

  const increaseRooms = useMutation({
    mutationFn: (id) => {
      return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/action', {
        action_person_id: id,
        action_type_id: 4
      })
    },
  })

  const createHouse = useMutation({
    mutationFn: (id) => {
      return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/action', {
        action_person_id: id,
        action_type_id: 5
      })
    },
  })
  return (
    <main>
      <h2 className="p-6 text-4xl">People</h2>
      { personData.length > 0 ? personData.map(({ person_id, person_name, person_family, person_actions, person_house, person_skills }) => (
        <>
          <a href={`/person/${person_id}`} className="p-6 pt-2 pb-2">
            <h3 className="text-xl font-semibold">{person_name} {familyName ? familyName : person_family.family_name}</h3>
            {
              queryClient ? <>
                <div className="flex">
                  <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                    <GrapeIcon className="w-5 h-5 mr-2" />
                    <span>{person_skills.person_skills_gatherer_level} Gather</span>
                  </div>
                  <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                    <TreesIcon className="w-5 h-5 mr-2" />
                    <span>{person_skills.person_skills_lumberjack_level} Lumber</span>
                  </div>
                  <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                    <HardHatIcon className="w-5 h-5 mr-2" />
                    <span>{person_skills.person_skills_builder_level} Build</span>
                  </div>
                </div>
              </> : <>
                <div className="flex">
                  <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                    <BriefcaseIcon className="w-5 h-5 mr-2" />
                    <span>{person_actions.length} Current Action</span>
                  </div>
                  <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span>{person_house?.house_address.house_address_number} {person_house?.house_address.house_address_road.house_road_name}</span>
                  </div>
                </div>
              </>
            }
          </a>
          {
            queryClient && userId === person_family.family_user_id ?
            <div>
              <Button
                size="sm"
                variant="ghost"
                className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 border-2 hover:text-gray-800 m-1 transition-colors"
                onClick={
                  () => {
                    increaseFood.mutate(person_id, { onSettled: (data, error: any) => {
                      queryClient.invalidateQueries()
                      if (error) {
                        document.getElementById("cm-" + person_id).innerText = error.response.data.message
                      } else {
                        document.getElementById("cm-" + person_id).innerText = ' '
                      }
                    }})
                  }
                } >Get Food</Button>
              <Button size="sm"
                variant="ghost"
                className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 border-2 hover:text-gray-800 m-1 transition-colors"
                onClick={
                () => {
                  increaseWood.mutate(person_id, { onSettled: (data, error: any) => {
                    queryClient.invalidateQueries()
                    if (error) {
                      document.getElementById("cm-" + person_id).innerText = error.response.data.message
                    } else {
                      document.getElementById("cm-" + person_id).innerText = ' '
                    }
                  }})
                }
              } >Get Wood</Button>
              <Button size="sm"
                variant="ghost"
                className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 border-2 hover:text-gray-800 m-1 transition-colors"
                onClick={
                () => {
                  increaseStorage.mutate(person_id, { onSettled: (data, error: any) => {
                    queryClient.invalidateQueries()
                    if (error) {
                      document.getElementById("cm-" + person_id).innerText = error.response.data.message
                    } else {
                      document.getElementById("cm-" + person_id).innerText = ' '
                    }
                  }})
                }
              } >Increase Storage</Button>
              <Button size="sm"
                variant="ghost"
                className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 border-2 hover:text-gray-800 m-1 transition-colors"
                onClick={
                () => {
                  increaseRooms.mutate(person_id, { onSettled: (data, error: any) => {
                    queryClient.invalidateQueries()
                    if (error) {
                      document.getElementById("cm-" + person_id).innerText = error.response.data.message
                    } else {
                      document.getElementById("cm-" + person_id).innerText = ' '
                    }
                  }})
                }
              } >Increase Rooms</Button>
              <Button size="sm"
                variant="ghost"
                className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 border-2 hover:text-gray-800 m-1 transition-colors"
                onClick={
                () => {
                  createHouse.mutate(person_id, { onSettled: (data, error: any) => {
                    queryClient.invalidateQueries()
                    if (error) {
                      document.getElementById("cm-" + person_id).innerText = error.response.data.message
                    } else {
                      document.getElementById("cm-" + person_id).innerText = ' '
                    }
                  }})
                }
              } >Create House</Button>
              {
                queryClient && person_actions[0]?.action_time_remaining ? <>
                  <br />
                  <small className="text-stone-500">{person_name} is performing an action completing in {person_actions[0].action_time_remaining}. </small>
                </> : <></>
              }
              <small className="text-stone-500" id={'cm-' + person_id}></small>
            </div> : null
          }
        </>
      )) :
        <a className="p-6 pt-2 pb-2">
          <h3 className="text-xl font-semibold">There are no people to show!</h3>
        </a>
      }
    </main>
  )
}