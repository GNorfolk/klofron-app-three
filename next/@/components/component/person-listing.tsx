import { BriefcaseIcon, MapPinIcon, TreesIcon, HardHatIcon, GrapeIcon } from '../ui/icon'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from "../ui/button"
import { useForm, SubmitHandler } from "react-hook-form"

export function PersonListing({ personData, familyName = null, queryClient = null, userId = null }) {
  type Inputs = {
    action_id: number,
    person_id: number
  }

  const onAction: SubmitHandler<Inputs> = (formData) => {
    onSubmit(formData, false)
  }

  const onQueue: SubmitHandler<Inputs> = (formData) => {
    onSubmit(formData, true)
  }

  const onSubmit = (formData, addToQueue) => {
    axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/action', {
      action_person_id: formData.person_id,
      action_type_id: formData.action_id
    }).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + formData.person_id).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + formData.person_id).innerText = error.response.data.message
    })
  }

  return (
    <main>
      <h2 className="p-6 text-4xl">People</h2>
      { personData.length > 0 ? personData.map(({ person_id, person_name, person_family, person_actions, person_house_id, person_house, person_skills }) => {
        const {
          register,
          handleSubmit,
          watch,
          formState: { errors },
        } = useForm<Inputs>()
        return (
          <>
            <a href={`/person/${person_id}`} className="p-6 pt-2 pb-2">
              <h3 className="text-xl font-semibold">{person_name} {familyName ? familyName : person_family.family_name}</h3>
              {
                queryClient ? <>
                  <div className="grid sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                    <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                      <GrapeIcon className="w-5 h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_skills.person_skills_gatherer_level} Gatherer level</span>
                    </div>
                    <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                      <TreesIcon className="w-5 h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_skills.person_skills_lumberjack_level} Lumberjack level</span>
                    </div>
                    <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                      <HardHatIcon className="w-5 h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_skills.person_skills_builder_level} Builder level</span>
                    </div>
                  </div>
                </> : <>
                  <div className="grid sm:grid-cols-2">
                    <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                      <BriefcaseIcon className="w-5 h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_actions.length} Current Action</span>
                    </div>
                    <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPinIcon className="w-5 h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_house?.house_address.house_address_number} {person_house?.house_address.house_address_road.house_road_name}</span>
                    </div>
                  </div>
                </>
              }
            </a>
            {
              queryClient && userId === person_family.family_user_id ? <>
                <div>
                  <form className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <input type="hidden" value={person_id} {...register("person_id")} />
                      <select {...register("action_id")} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                        <option value="1">Get Food</option>
                        <option value="2">Get Wood</option>
                        <option value="3">Increase Storage</option>
                        <option value="4">Increase Rooms</option>
                        <option value="5">Create House</option>
                      </select>
                      <Button size="sm"
                        variant="ghost"
                        className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 border-2 hover:text-gray-800 m-1 transition-colors"
                        onClick={handleSubmit(onAction)}
                      >Start Action</Button>
                      <Button size="sm"
                        variant="ghost"
                        className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 border-2 hover:text-gray-800 m-1 transition-colors"
                        onClick={handleSubmit(onQueue)}
                      >Add to Queue</Button>
                    </div>
                  </form>
                  {
                    queryClient && person_actions[0]?.action_time_remaining ? <>
                      <small className="text-stone-500 ml-2">{person_name} is performing an action completing in {person_actions[0].action_time_remaining}. </small>
                    </> : <></>
                  }
                  <small className="text-stone-500" id={'cm-' + person_id}></small>
                </div>
              </> : null
            }
          </>
        )
      }) :
        <a className="p-6 pt-2 pb-2">
          <h3 className="text-xl font-semibold">There are no people to show!</h3>
        </a>
      }
    </main>
  )
}