import axios from 'axios'
import { GrayButton } from "../ui/button"
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { HeaderOne, HeaderTwo, HeaderThree } from '../ui/header'
import { DivIconInfo } from '../ui/div'
import { StyledSelect } from '../ui/input'
import { Small } from '../ui/text'
import { StyledLink } from '../ui/link'

export function PersonListing({ personData, familyName = null, queryClient = null, userId = null }) {
  return (
    <main>
      <HeaderOne>People</HeaderOne>
      { personData.length > 0 ? personData.map((person) => {
        return (
          <PersonCard
            key={person.person_id}
            person={person}
            familyName={familyName}
            queryClient={queryClient}
            userId={userId}
          />
        )
      }) :
        <a className="p-6 pt-2 pb-2">
          <HeaderThree>There are no people to show!</HeaderThree>
        </a>
      }
    </main>
  )
}

export function PersonInfo({ title, personInfo }) {
  return (
    <main>
      <HeaderTwo>{title + " Info"}</HeaderTwo>
        <StyledLink href={"/person/" + personInfo.person_id + "/betrothal"}>
          <div className="grid grid-cols-1">
            <div className="grid grid-cols-1">
              <DivIconInfo iconType="UserIcon">{personInfo.person_name + " " + personInfo.person_family.family_name + "is a" + personInfo.person_age + " year old " + personInfo.person_gender + "."}</DivIconInfo>
            </div>
            <div className="grid sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              <DivIconInfo iconType="GrapeIcon">{personInfo.person_skills.person_skills_gatherer_level + " Gatherer level"}</DivIconInfo>
              <DivIconInfo iconType="TreesIcon">{personInfo.person_skills.person_skills_lumberjack_level + " Lumberjack level"}</DivIconInfo>
              <DivIconInfo iconType="HardHatIcon">{personInfo.person_skills.person_skills_builder_level + " Builder level"}</DivIconInfo>
            </div>
          </div>
        </StyledLink>
    </main>
  )
}

function PersonCard({ person, familyName, queryClient, userId }) {
  type Inputs = {
    action_type_id: number,
    action_queue_id: number
  }
  const methods = useForm<Inputs>();

  const onSubmit = (formData: Inputs, addToQueue: number) => {
    axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v3/action', {
      action_queue_id: formData.action_queue_id,
      action_type_id: formData.action_type_id,
      action_add_to_queue: addToQueue
    }).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + formData.action_queue_id).innerText = " "
    }).catch(error => {
      document.getElementById("cm-" + formData.action_queue_id).innerText = error.response?.data.message
    })
  }

  const onAction: SubmitHandler<Inputs> = (formData) => {
    onSubmit(formData, 0);
  }

  const onQueue: SubmitHandler<Inputs> = (formData) => {
    onSubmit(formData, 1);
  }

  const { person_id, person_name, person_family, person_action_queue, person_action_queue_id, person_house, person_skills, person_teacher_id } = person;

  return (
    <>
      <StyledLink href={`/person/${person_id}`}>
        <HeaderThree>{familyName ? person_name + " " + familyName : person_name + " " + person_family.family_name}</HeaderThree>
        {
          queryClient ? <>
            <div className="grid sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              <DivIconInfo iconType="GrapeIcon">{person_skills.person_skills_gatherer_level + " Gatherer level"}</DivIconInfo>
              <DivIconInfo iconType="TreesIcon">{person_skills.person_skills_lumberjack_level + " Lumberjack level"}</DivIconInfo>
              <DivIconInfo iconType="HardHatIcon">{person_skills.person_skills_builder_level + " Builder level"}</DivIconInfo>
            </div>
          </> : <>
            <div className="grid grid-cols-2">
              <DivIconInfo iconType="BriefcaseIcon">{person_action_queue.action_queue_action_cooldown != null ? person_action_queue.action_queue_action_cooldown.action_cooldown_time_remaining + " cooldown" : "Available for work"}</DivIconInfo>
              <DivIconInfo iconType="MapPinIcon">{person_house?.house_address.house_address_number + " " + person_house?.house_address.house_address_road.house_road_name}</DivIconInfo>
            </div>
          </>
          }
      </StyledLink>

      {queryClient && userId === person_family?.family_user_id && (
        <div>
          <FormProvider {...methods}>
            <form className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <input type="hidden" value={person_action_queue_id} {...methods.register("action_queue_id")} />
                <StyledSelect fieldName="action_type_id" fieldRequired={true}>
                  {person_teacher_id ? (
                    <option selected disabled value="-1">Unavailable</option>
                  ) : (
                    <>
                      <option value="1">Get Food</option>
                      <option value="2">Get Wood</option>
                      <option value="3">Increase Storage</option>
                      <option value="4">Increase Rooms</option>
                      <option value="5">Create House</option>
                    </>
                  )}
                </StyledSelect>
                <GrayButton onClick={methods.handleSubmit(onAction)} text="Start Action" />
                <GrayButton onClick={methods.handleSubmit(onQueue)} text={`(${person_action_queue.action_queue_next_actions.length}) Add to Queue`} />
              </div>
            </form>
          </FormProvider>
          {
            queryClient && person_action_queue.action_queue_action_cooldown?.action_cooldown_time_remaining ? person_action_queue.action_queue_action_cooldown.action_cooldown_diceroll_id ? <>
              <small className="text-gray-500 ml-2">{person_name} rolled black[{person_action_queue.action_queue_action_cooldown.action_cooldown_diceroll.action_diceroll_black_roll}+{person_action_queue.action_queue_action_cooldown.action_cooldown_diceroll.action_diceroll_skill_level}] against red[{person_action_queue.action_queue_action_cooldown.action_cooldown_diceroll.action_diceroll_red_roll}] and has {person_action_queue.action_queue_action_cooldown.action_cooldown_time_remaining} cooldown. </small>
            </> : <>
              <small className="text-gray-500 ml-2">{person_name} performed an action and has {person_action_queue.action_queue_action_cooldown.action_cooldown_time_remaining} cooldown. </small>
            </> : <></>
          }
          <Small uid={person_action_queue_id}></Small>
        </div>
      )}
    </>
  )
}
