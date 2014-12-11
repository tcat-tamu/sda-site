<?php

namespace SDA\SubscriptionBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use SDA\SubscriptionBundle\Entity\Subscriber;
use SDA\SubscriptionBundle\Form\SubscriberType;

/**
 * Subscriber controller.
 *
 * @Route("/")
 */
class SubscriberController extends Controller
{

    /**
     * Lists all Subscriber entities.
     *
     * @Route("/", name="sub_list")
     * @Method("GET")
     * @Security("has_role('ROLE_SUPER_ADMIN')")
     * @Template
     */
    public function indexAction()
    {
        $entities =  $this->getDoctrine()->getManager()
            ->getRepository('SDASubscriptionBundle:Subscriber')
            ->findAll();

        return array(
            'entities' => $entities,
        );
    }

    /**
     * Creates a new Subscriber entity.
     *
     * @Route("/", name="sub_create")
     * @Method("POST")
     */
    public function createAction(Request $request)
    {
        $entity = new Subscriber();

        $form = $this->createForm(new SubscriberType(), $entity);
        $form->submit($request->request->all());

        if (!$form->isValid()) {
            return new Response('Malformed Subscriber information', Response::HTTP_BAD_REQUEST);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($entity);
        $em->flush();

        return new Response('Subscriber Created');
    }

    /**
     * Marks a Subscriber entity as entered
     *
     * @Route("/enter/{id}", name="sub_enter")
     * @Method({"GET", "PUT"})
     * @Security("has_role('ROLE_SUPER_ADMIN')")
     */
    public function enterAction(Subscriber $entity) {
        $entity->setEntered(true);
        $this->getDoctrine()->getManager()->flush();
        return $this->redirect($this->generateUrl('sub_list'));
    }

    /**
     * Deletes a Subscriber entity.
     *
     * @Route("/delete/{id}", name="sub_delete")
     * @Method({"GET", "DELETE"})
     * @Security("has_role('ROLE_SUPER_ADMIN')")
     */
    public function deleteAction(Subscriber $entity, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $em->remove($entity);
        $em->flush();

        return $this->redirect($this->generateUrl('sub_list'));
    }

}
