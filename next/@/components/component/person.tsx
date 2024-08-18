import { BriefcaseIcon, MapPinIcon, TreesIcon, HardHatIcon, GrapeIcon, UserIcon } from '../ui/icon'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from "../ui/button"
import { useForm, SubmitHandler } from "react-hook-form"

export function PersonListing({ personData, familyName = null, queryClient = null, userId = null }) {
  type Inputs = {
    action_type_id: number,
    action_queue_id: number
  }

  const onAction: SubmitHandler<Inputs> = (formData) => {
    onSubmit(formData, 0)
  }

  const onQueue: SubmitHandler<Inputs> = (formData) => {
    onSubmit(formData, 1)
  }

  const onSubmit = (formData: Inputs, addToQueue: number) => {
    axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/action', {
      action_queue_id: formData.action_queue_id,
      action_type_id: formData.action_type_id,
      action_add_to_queue: addToQueue
    }).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + formData.action_queue_id).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + formData.action_queue_id).innerText = error.response.data.message
    })
  }

  return (
    <main>
      <h2 className="p-6 text-4xl">People</h2>
      { personData.length > 0 ? personData.map(({ person_id, person_name, person_family, person_action_queue, person_action_queue_id, person_house, person_skills, person_teacher_id }) => {
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
                      <GrapeIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_skills.person_skills_gatherer_level} Gatherer level</span>
                    </div>
                    <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                      <TreesIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_skills.person_skills_lumberjack_level} Lumberjack level</span>
                    </div>
                    <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                      <HardHatIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_skills.person_skills_builder_level} Builder level</span>
                    </div>
                  </div>
                </> : <>
                  <div className="grid grid-cols-2">
                    <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                      <BriefcaseIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                      {/* TODO FIX */}
                      <span className='whitespace-nowrap'>{person_action_queue.action_queue_current_action ? "One" : "No"} Current Action</span>
                    </div>
                    <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPinIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_house?.house_address.house_address_number} {person_house?.house_address.house_address_road.house_road_name}</span>
                    </div>
                  </div>
                </>
              }
            </a>
            {
              queryClient && userId === person_family?.family_user_id ? <>
                <div>
                  <form className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <input type="hidden" value={person_action_queue_id} {...register("action_queue_id")} />
                      <select {...register("action_type_id")} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                        {
                          person_teacher_id ? <>
                            <option selected disabled value="-1">Unavailable</option>
                          </> : <>
                            <option value="1">Get Food</option>
                            <option value="2">Get Wood</option>
                            <option value="3">Increase Storage</option>
                            <option value="4">Increase Rooms</option>
                            <option value="5">Create House</option>
                          </>
                        }
                      </select>
                      <Button size="sm"
                        variant="ghost"
                        className="bg-gray-900 text-gray-500 hover:bg-gray-950 border-gray-950 border-2 hover:text-gray-400 m-1 transition-colors"
                        onClick={handleSubmit(onAction)}
                      >Start Action</Button>
                      <Button size="sm"
                        variant="ghost"
                        className="bg-gray-900 text-gray-500 hover:bg-gray-950 border-gray-950 border-2 hover:text-gray-400 m-1 transition-colors"
                        onClick={handleSubmit(onQueue)}
                      >{"(" + person_action_queue.action_queue_next_actions.length + ") Add to Queue"}</Button>
                    </div>
                  </form>
                  {
                    queryClient && person_action_queue.action_queue_current_action?.action_time_remaining ? <>
                      <small className="text-stone-500 ml-2">{person_name} is performing an action completing in {person_action_queue.action_queue_current_action.action_time_remaining}. </small>
                    </> : <></>
                  }
                  <small className="text-stone-500" id={'cm-' + person_action_queue_id}></small>
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

export function PersonInfo({ title, personInfo }) {
  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">{title + " Info"}</h2>
        <a href={"/person/" + personInfo.person_id + "/betrothal"} className="p-6 pt-2 pb-2">
          <div className="grid grid-cols-1">
            <div className="grid grid-cols-1">
              <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                <UserIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                <span>{personInfo.person_name} {personInfo.person_family.family_name} is a {personInfo.person_age} year old {personInfo.person_gender}.</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                <GrapeIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                <span className='whitespace-nowrap'>{personInfo.person_skills.person_skills_gatherer_level} Gatherer level</span>
              </div>
              <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                <TreesIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                <span className='whitespace-nowrap'>{personInfo.person_skills.person_skills_lumberjack_level} Lumberjack level</span>
              </div>
              <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
                <HardHatIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                <span className='whitespace-nowrap'>{personInfo.person_skills.person_skills_builder_level} Builder level</span>
              </div>
            </div>
          </div>
        </a>
    </main>
  )
}